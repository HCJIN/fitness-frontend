// 우리 Spring 서버와 통신할 때는 axios 인스턴스를 씁니다
// 이 인스턴스 안에 JWT 자동 포함, 401 자동 로그아웃이 이미 설정되어 있기 때문에
// 매번 새로 axios를 쓰면 그 처리를 모든 파일마다 다시 해야 해서 비효율적입니다 
import api from './axios';

// 부위별 운동 목록 조회
// params: { part } 를 쓰는 이유 ->
// axios가 자동으로 /api/exercises?part=CHEST 형태로 URL을 만들어줍니다
// 직접 문자열로 ?part=${part} 써도 되지만 params 객체가 더 안전하고 가독성이 좋습니다.
export const getExercisesByPart = (part) => {
  return api.get('/api/exercises', { params: { part } });
}

// 운동 상세 조회
// id를 URL 경로에 직접 넣는 이유 ->
// REST API 설계 원칙상 특정 리소스 하나를 가리킬 때는 경로에 id를 넣습니다
// /api/exercises?id=1 이 아니라 /api/exercises/1 이 올바른 방식입니다
export const getExerciseById = (id) => {
  return api.get(`/api/exercises/${id}`);
}

// YouTube 영상 검색
// async/await를 쓰는 이유 -> 
// fetch()는 Promise를 반환하는데, await 없이 쓰면 응답이 오기 전에 다음 줄이 실행됩니다
// async/await로 응답이 완전히 올 때까지 기다리게 만들어야 데이터를 제대로 쓸 수 있습니다
export const searchYoutubeVideos = async (keyword) => {

  // import.meta.env 는 Vite에서 .env 파일을 읽는 방법입니다
  // Create React App이었으면 processs.env.REACT_APP_ 이었을 텐데
  // Vite는 import.meta.env.VITE_ 로 읽습니다
  // VITE_ 로 시작해야만 Vite가 클라이언트에 노출시켜 줍니다
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // YouTube API는 우리 Spring 서버가 아니라 Google 서버에 직접 호출합니다
  // 그래서 api.get() 이 아니라 그냥 fetch() 를 씁니다
  // Spring 서버를 거칠 이유가 없기 때문입니다
  //
  // encodeURIComponent() 를 쓰는 이유 ->
  // 검색어에 한글이나 공백이 있으면 URL이 깨집니다
  // encodeURIComponent( '벤치 프레스' ) -> 'bench%20press' 처럼 URL에 안전한 형태로 변환해줍니다
  //
  // maxResults=10 → 쇼츠 필터링 후 3개를 남기기 위해 넉넉하게 10개를 먼저 가져옵니다
  // videoDuration=short → YouTube 기준 4분 이하 영상만 검색합니다 (쇼츠가 여기 포함됩니다)
  // relevanceLanguage=ko → 한국어 콘텐츠를 우선적으로 노출합니다
  // regionCode=KR → 한국 지역 기준으로 검색 결과를 가져옵니다
  // q에 shorts를 붙이는 이유 → YouTube가 쇼츠 콘텐츠를 더 잘 찾아주기 때문입니다
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)} shorts&type=video&maxResults=10&key=${API_KEY}&relevanceLanguage=ko&regionCode=KR&videoDuration=short`
  );

  const searchData = await searchRes.json();
  const items = searchData.items;

  // videoId 목록을 콤마로 연결해서 duration 한 번에 조회하는 이유 →
  // 영상마다 따로 API를 호출하면 10번 호출해야 하지만
  // id를 콤마로 연결하면 1번 호출로 전부 가져올 수 있어서 API 유닛을 아낄 수 있습니다
  const ids = items.map(v => v.id.videoId).join(',');

  // contentDetails → 영상 길이(duration) 정보가 여기에 담겨 있습니다
  const detailRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${ids}&key=${API_KEY}`
  );
  const detailData = await detailRes.json();

  // ISO 8601 duration 형식을 초로 변환하는 함수입니다
  // YouTube API는 영상 길이를 PT1M30S (1분 30초) 형태로 줍니다
  // 정규식으로 분(M)과 초(S)를 꺼내서 초 단위로 환산합니다
  // 예) PT1M30S → 1*60 + 30 = 90초
  // 예) PT45S   → 0*60 + 45 = 45초 (분이 없으면 0으로 처리)
  const toSeconds = (duration) => {
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
    return (parseInt(match[1] || 0) * 60) + parseInt(match[2] || 0);
  };

  // 60초 이하인 영상의 id만 골라냅니다
  // YouTube Shorts는 최대 60초이기 때문에 이 기준으로 진짜 쇼츠를 필터링합니다
  const shortIds = detailData.items
    .filter(v => toSeconds(v.contentDetails.duration) <= 60)
    .map(v => v.id);

  // 쇼츠에 해당하는 영상만 남기고 최대 3개만 반환합니다
  // slice(0, 3) → 배열의 0번째부터 2번째까지 (총 3개) 를 잘라냅니다
  return items.filter(v => shortIds.includes(v.id.videoId)).slice(0, 3);

};