import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function getUser() {
  const userStr = localStorage.getItem('eatwhat_user');
  return userStr ? JSON.parse(userStr) : null;
}

export function logout() {
  localStorage.removeItem('eatwhat_user');
  window.location.reload();
}

const UserMenu: React.FC<{ username: string }> = ({ username }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [open]);

  return (
    <div className="user-menu-wrap">
      <div
        className="user-menu-trigger-plain" // 关键改动
        onClick={e => {
          e.stopPropagation();
          setOpen(o => !o);
        }}
      >
        {username}
        <span className="user-menu-arrow">▼</span>
      </div>
      {open && (
        <div className="user-menu-dropdown" onClick={e => e.stopPropagation()}>
          <div className="user-menu-item" onClick={logout}>
            退出
          </div>
        </div>
      )}
    </div>
  );
};

const LoginButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = getUser();

  if (user) {
    return <UserMenu username={user.username} />;
  }
  return (
    <button className="login-btn" onClick={() => navigate('/login')}>
      {t('login')}
    </button>
  );
};

export default LoginButton;
