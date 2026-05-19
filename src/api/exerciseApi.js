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
  // maxResults=3 -> 영상 3개만 가져옵니다 (YouTube API는 호출당 유닛을 소모하기 때문에 최소로)
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(keyword)}&type=video&maxResults=3&key=${API_KEY}`
  );

  const data = await response.json();

  // data 전체가 아니라 data.items 만 반환하는 이유 ->
  // YouTube API 응답에는 kind, etag, nextPageToken 등 우리가 필요없는 정보가 많습니다
  // 실제 영상 목록은 items 배열 안에 있어서 그것만 꺼내서 반환합닌다
  return data.items;

};