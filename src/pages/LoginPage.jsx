import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import './AuthPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/auth/login', form);
      const { data } = res.data;  // { success, data: { token }, message }
      login(data.token, null);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* 왼쪽 — 슬로건 영역 */}
      <div className="auth-left">
        <div className="auth-left-bg" />
        <div className="auth-left-accent" />

        <div className="auth-logo">FIT<span>QUEST</span></div>

        <div className="auth-left-content">
          <div className="auth-left-icon">🏋️</div>
          <h1 className="auth-headline">
            PUSH YOUR<br />
            <span className="auth-headline-accent">LIMITS.</span><br />
            TRACK YOUR<br />
            PROGRESS.
          </h1>
          <p className="auth-left-sub">
            운동 검색부터 퀘스트, 포인트, 랭킹까지.<br />
            오늘의 루틴을 시작하세요.
          </p>
          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-num">50+</span>
              <span className="auth-stat-label">운동 종류</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-num">20+</span>
              <span className="auth-stat-label">퀘스트</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-num">∞</span>
              <span className="auth-stat-label">성취감</span>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 — 로그인 폼 */}
      <div className="auth-right">
        <div className="auth-tab-row">
          <Link to="/login" className="auth-tab active">로그인</Link>
          <Link to="/signup" className="auth-tab">회원가입</Link>
        </div>

        <h2 className="auth-form-title">WELCOME BACK</h2>
        <p className="auth-form-sub">다시 돌아온 걸 환영해요 💪</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <div className="auth-pw-row">
              <label>비밀번호</label>
              <a href="#">비밀번호 찾기</a>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn-main" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">또는</span>
          <div className="auth-divider-line" />
        </div>

        <p className="auth-signup-link">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  );
}