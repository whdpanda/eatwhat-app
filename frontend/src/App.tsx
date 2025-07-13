import React from 'react';
import './App.css';
import LanguageSwitcher from './components/LanguageSwitcher';
import HomePage from './pages/HomePage';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  return (
    <div className="app-container" style={{ position: 'relative' }}>
      <LanguageSwitcher />
      <h1>{t('title')}</h1>
      <HomePage />
    </div>
  );
}

export default App;
