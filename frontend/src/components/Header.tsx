import React from 'react';

import LanguageSwitcher from './LanguageSwitcher';
import LoginButton from './LoginButton';

const Header: React.FC = () => {


  return (
    <div className="app-header">
      <LanguageSwitcher />
      <LoginButton />
    </div>
  );
};

export default Header;
