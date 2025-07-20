import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const USER_KEY = 'eatwhat_user';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

   async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    // 这里你可以调用真实后端API
    // const res = await fetch('/api/login', { ... });
    // 示例：只要有内容就视为登录成功
    if (username && password) {
      localStorage.setItem(USER_KEY, JSON.stringify({ username }));
      navigate('/');
    } else {
      setErr(t('login_required'));
    }
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
        <button type="submit" className="button-main" style={{ width: '100%' }}>
          {t('login')}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;