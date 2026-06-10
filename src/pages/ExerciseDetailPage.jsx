// useEffect  → 컴포넌트가 화면에 그려진 직후 실행할 코드를 등록하는 Hook
// useState   → 컴포넌트 안에서 변하는 데이터를 관리하는 Hook
import { useEffect, useState } from 'react';

// useParams  → URL 경로에서 값을 꺼내는 Hook (/exercise/1 에서 1을 꺼냄)
// useNavigate → 코드로 페이지를 이동시키는 Hook (뒤로가기 버튼에 사용)
import { useParams, useNavigate } from 'react-router-dom';

import { getExerciseById, searchYoutubeVideos } from '../api/exerciseApi';

import './ExerciseDetailPage.css';

export default function ExerciseDetailPage() {

  // URL에서 id를 꺼냅니다
  // /exercise/1 로 접속하면 id = "1" 이 됩니다
  const { id } = useParams();
  const navigate = useNavigate();

  // null로 초기화하는 이유 →
  // 아직 데이터를 못 받아온 상태를 표현하기 위해서입니다
  // null이면 "아직 없음", 데이터가 오면 객체로 교체됩니다
  const [exercise, setExercise] = useState(null);

  // 빈 배열로 초기화하는 이유 →
  // 영상은 여러 개라서 배열이 자연스럽습니다
  // 빈 배열이면 "아직 없음", 데이터가 오면 배열로 교체됩니다
  const [videos, setVideos] = useState([]);

  // 로딩 중일 때 "불러오는 중..." 을 보여주기 위한 상태입니다
  // true로 시작하는 이유 → 처음엔 항상 로딩 상태이기 때문입니다
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect 안에서 API를 호출하는 이유 →
  // 컴포넌트가 화면에 그려진 후에 데이터를 가져와야 하기 때문입니다
  // useEffect 밖에서 직접 호출하면 렌더링할 때마다 API가 계속 호출됩니다
  //
  // [id] 를 의존성 배열로 넣는 이유 →
  // id가 바뀔 때마다 다시 API를 호출하게 만들기 위해서입니다
  // 빈 배열 [] 이면 처음 한 번만 실행됩니다
  useEffect(() => {

    // useEffect 안에서는 async를 직접 못 씁니다
    // 그래서 async 함수를 안에서 만들고 바로 호출하는 패턴을 씁니다
    const fetchData = async () => {
      try {
        const res = await getExerciseById(id);

        // ApiResponse 구조가 { success, data, message } 이기 때문에
        // 실제 운동 데이터는 res.data.data 안에 있습니다
        const exerciseData = res.data.data;
        setExercise(exerciseData);

        // 운동 상세에 저장된 youtubeSearchKeyword 로 영상을 검색합니다
        // 예) 'bench press tutorial' 로 YouTube에서 검색
        const videoResults = await searchYoutubeVideos(exerciseData.youtubeSearchKeyword);
        setVideos(videoResults);

      } catch (err) {
        console.log('에러 내용:', err);           // 에러 객체 전체
        console.log('응답 상태:', err.response?.status);  // 상태코드
        console.log('응답 데이터:', err.response?.data);  // 응답 내용
        setError('운동 정보를 불러오지 못했습니다.');
      } finally {
        // try/catch 결과와 상관없이 항상 실행됩니다
        // 성공하든 실패하든 로딩은 끝났으니 false로 바꿉니다
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 조건부 렌더링 →
  // 데이터가 아직 없거나 에러가 있으면 일찍 return해서 아래 JSX를 그리지 않습니다
  // 이걸 early return 패턴이라고 합니다
  if (loading) return <div className="center">불러오는 중...</div>;
  if (error) return <div className="center">{error}</div>;
  if (!exercise) return null;

  return (
    <div className="container">

      {/* navigate(-1) → 브라우저 히스토리에서 한 칸 뒤로 갑니다
          -1은 "한 페이지 뒤로" 라는 뜻입니다 */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      <div className="card">
        <span className="badge">{exercise.part}</span>
        <h1 className="title">{exercise.name}</h1>
        <p className="description">{exercise.description}</p>
      </div>

      <h2 className="section-title">관련 영상</h2>

      {/* videos.length === 0 으로 체크하는 이유 →
          영상이 없거나 API 호출에 실패했을 때 빈 화면 대신 안내 문구를 보여주기 위해서입니다 */}
      {videos.length === 0 ? (
        <p className="no-video">영상을 불러올 수 없습니다.</p>
      ) : (
        <div className="video-list">
          {videos.map((video) => (

            // key를 넣는 이유 →
            // React는 목록을 그릴 때 각 항목을 구별하기 위해 key가 필요합니다
            // key가 없으면 경고가 뜨고 렌더링 성능이 나빠집니다
            // videoId는 YouTube 영상마다 고유한 값이라 key로 적합합니다
            <div key={video.id.videoId} className="video-card">

              {/* iframe으로 YouTube 영상을 직접 페이지에 임베드합니다
                  src에 videoId를 넣으면 해당 영상이 플레이어로 표시됩니다
                  allowFullScreen → 전체화면 버튼을 활성화합니다
                  rel=0 → 영상 끝난 후 관련 영상을 같은 채널 것만 보여줍니다 (광고성 영상 최소화) */}
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.id.videoId}?rel=0`}
                title={video.snippet.title}
                frameBorder="0"
                allowFullScreen
              />
              <p className="video-title">{video.snippet.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}