import React from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';  // 新增
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function AppRoutes() {
  const location = useLocation();
  // 只在首页显示 Header
  const showHeader = location.pathname === '/';

  return (
    <div className="app-container">
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* 新增注册路由 */}
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
