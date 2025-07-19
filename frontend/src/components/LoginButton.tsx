import React from 'react';
import { useNavigate } from 'react-router-dom';

const USER_KEY = 'eatwhat_user';

export function getUser() {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
  window.location.reload();
}

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  if (user) {
    return (
      <div style={{ position: 'absolute', top: 30, right: 30, zIndex: 22 }}>
        <span style={{ marginRight: 16 }}>{user.username}</span>
        <button onClick={logout} style={{ fontSize: 14, padding: '4px 14px' }}>退出</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', top: 30, right: 30, zIndex: 22 }}>
      <button
        style={{ fontSize: 16, padding: '4px 18px', borderRadius: 7 }}
        onClick={() => navigate('/login')}
      >登录</button>
    </div>
  );
};

export default LoginButton;
