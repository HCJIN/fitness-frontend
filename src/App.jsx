import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import useAuthStore from './store/authStore';

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

        {/* 없는 경로 → 로그인으로 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}