import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const USER_KEY = 'eatwhat_user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // 可用 .env 控制

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErr(data.error || t('login_failed'));
        setLoading(false);
        return;
      }
      const data = await res.json();
      // 这里你可以把 token 存 localStorage，如果有的话
      localStorage.setItem(USER_KEY, JSON.stringify({ username: data.username }));
      navigate('/');
    } catch (e) {
      setErr(t('login_failed'));
    }
    setLoading(false);
  }

  return (
    <div className="app-container" style={{ maxWidth: 320 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{t('login_title')}</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder={t('login_username')}
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 7, border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: 22 }}>
          <input
            type="password"
            placeholder={t('login_password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', fontSize: 16, padding: '8px 10px', borderRadius: 7, border: '1px solid #ccc' }}
          />
        </div>
        {err && <div className="error-msg">{err}</div>}
        <button type="submit" className="button-main" style={{ width: '100%' }} disabled={loading}>
          {loading ? t('loading') : t('login')}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
