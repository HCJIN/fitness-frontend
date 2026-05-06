import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './AuthPage.css';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.nickname.trim()) return '닉네임을 입력해주세요.';
    if (!form.email.trim()) return '이메일을 입력해주세요.';
    if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) return '비밀번호가 일치하지 않습니다.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/api/auth/signup', {
        nickname: form.nickname,
        email: form.email,
        password: form.password,
      });
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* 왼쪽 — 슬로건 영역 (LoginPage와 동일) */}
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

      {/* 오른쪽 — 회원가입 폼 */}
      <div className="auth-right">
        <div className="auth-tab-row">
          <Link to="/login" className="auth-tab">로그인</Link>
          <Link to="/signup" className="auth-tab active">회원가입</Link>
        </div>

        <h2 className="auth-form-title">JOIN NOW</h2>
        <p className="auth-form-sub">지금 시작해서 목표를 달성하세요 🔥</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              placeholder="헬스왕"
              value={form.nickname}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="8자 이상 입력"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 재입력"
              value={form.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn-main" disabled={loading}>
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-signup-link" style={{ marginTop: '24px' }}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}