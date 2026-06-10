import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import useAuthStore from './store/authStore';
// ExerciseDetailPage를 import 합니다
// 경로를 ./pages/ExerciseDetailPage 로 쓰는 이유 →
// App.jsx 기준으로 pages 폴더 안에 있기 때문입니다
import ExerciseDetailPage from './pages/ExerciseDetailPage';

// 로그인 안 했으면 /login 으로 튕기는 보호 라우트
function PrivateRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// 이미 로그인했으면 / 로 보내는 라우트 (로그인 페이지 재접근 방지)
function PublicRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* 보호 라우트 — 추후 페이지 추가 시 여기에 계속 추가 */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              {/* 추후 <HomePage /> 로 교체 */}
              <div style={{ color: '#fff', padding: '40px', fontFamily: 'sans-serif' }}>
                🏋️ 홈 페이지 (준비 중)
              </div>
            </PrivateRoute>
          }
        />

        {/* /exercise/:id 로 등록하는 이유 →
          :id 는 "여기에 어떤 숫자나 문자가 와도 된다" 는 뜻입니다
          /exercise/1, /exercise/2 모두 이 라우트가 받아서 ExerciseDetailPage를 보여줍니다
          useParams() 로 그 값을 꺼낼 수 있습니다 */}
        <Route
          path="/exercise/:id"
          element={
            <PrivateRoute>
              <ExerciseDetailPage />
            </PrivateRoute>
          }
        />

        {/* 없는 경로 → 로그인으로 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}