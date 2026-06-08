// 상태관리(useState), 사이드 이펙트 처리(useEffect)훅을 가져옴.
import { useState, useEffect } from 'react';

// 리액트 라우터에서 페이지 이동 기능을 제공
// navigate('/경로') 형태로 사용
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import './ExercisePage.css';

// ExercisePage를 선언하고 외부에서 사용 가능하도록 export 함.
// App.jsx나 라우터에서 이 컴포넌트를 불러다 사용
export default function ExercisePage() {

    // 페이지 이동 함수를 navigate 변수에 담습니다.
    const navigate = useNavigate();

    // 현재 선택된 운동 부위 탭을 저장. 초기값은 'CHEST'(가슴)으로 설정
    const [currentPart, setCurrentPart] = useState('CHEST');
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const parts = [
        {key: 'CHEST', label: '가슴'},
        {key: 'BACK', label: '등'},
        {key: 'LEG', label: '하체'},
        {key: 'SHOULDER', label: '어깨'},
        {key: 'ARM', label: '팔'}
    ];

    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get(`/api/exercises?part=${currentPart}}`);
                setExercises(response.data);
            } catch (err) {
                setError(err.response?.data?.message || '운동 목록을 불러오지 못했습니다.');
            }finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, [currentPart]);

    return (
        <div className="exercise-container">
            <div className="exercise-header">
                <h1 className="exercise-logo">FIT<span>QUEST</span> WORKOUTS</h1>
                <p className="exercise-sub">나만의 한계를 극복하기 위한 부위별 타겟 운동 리스트</p>
            </div>

            <div className="exercise-tab-row">
                {parts.map((part) => (
                    <button key={part.key} className={`exercise-tab ${currentPart === part.key ? 'active' : ''}`} onClick={() => setCurrentPart(part.key)}>
                        {part.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="exercise-status">로딩 중...</div>
            ) : error ? (
                <div className="exercise-error">{error}</div>
            ) : (
                <div className="exercise-grid">
                    {exercises.map((exercise) => (
                        <div key={exercise.id} className="exercise-card" onClick={() => navigate(`/exercise/${exercise.id}`)}>
                            <div className="card-badge">{currentPart}</div>
                            <h3 className="card-name">{exercise.description}</h3>
                            <p className="card-desc">{exercise.description}</p>
                            <div className="card-footer">
                                <span className="card-keyword">{exercise.youtubeSearchKeyword}</span>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
}