import React from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <h1>{t('title')}</h1>
              <HomePage />
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
