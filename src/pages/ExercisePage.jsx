// // 상태관리(useState), 사이드 이펙트 처리(useEffect)훅을 가져옴.
// import { useState, useEffect } from 'react';
//
// // 리액트 라우터에서 페이지 이동 기능을 제공
// // navigate('/경로') 형태로 사용
// import { useNavigate } from 'react-router-dom';
// import api from '../api/exercise';
// import './ExercisePage.css';
//
// export default function ExercisePage() {
//     const navigate = useNavigate();
//     const [currentPart, setCurrentPart] = useState('CHEST');
//     const [exercises, setExercises] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//
//     const parts = [
//         {key: 'CHEST', label: '가슴'},
//         {key: 'BACK', label: '등'},
//         {key: 'LEG', label: '하체'},
//         {key: 'SHOULDER', label: '어깨'},
//         {key: 'ARM', label: '팔'}
//     ];
//
//     useEffect(() => {
//         const fetchExercises = async () => {
//             setLoading(true);
//             setError('');
//
//             try {
//                 const response = await api.get(`/api/exercises?part=${currentPart}}`);
//                 setExercises(response.data);
//             } catch (err) {
//                 setError(err.response?.data?.message || '운동 목록을 불러오지 못했습니다.');
//             }finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchExercises();
//     }, [currentPart]);
//
//
// }