import React from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-header">
      <LanguageSwitcher />
      <button
        className="login-btn"
        onClick={() => navigate('/login')}
      >
        登录
      </button>
    </div>
  );
};

export default Header;
