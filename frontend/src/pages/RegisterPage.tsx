import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // 需要自动跳转
import { useTranslation } from "react-i18next";

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = process.env.REACT_APP_API_URL || 'https://api.randomeatwhat.com';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");         
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();   // 启用路由跳转

  // 简单邮箱格式校验
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError(t("register.enter_username_email_password"));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t("register.invalid_email"));
      return;
    }
    if (password.length < 6) {
      setError(t("register.password_length"));
      return;
    }
    if (password !== password2) {
      setError(t("register.password_mismatch"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("register.failed"));
      } else {
        // 注册成功后自动跳转到邮箱验证页面，带邮箱参数
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError(t("register.network_error"));
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <h2 className="register-title">{t("register_title")}</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          className="register-input"
          type="text"
          placeholder={t("register_username")}
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          className="register-input"
          type="email"
          placeholder={t("register_email")}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          placeholder={t("register_password")}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          placeholder={t("register_password_repeat")}
          value={password2}
          onChange={e => setPassword2(e.target.value)}
        />
        <button className="register-button" type="submit" disabled={loading}>
          {loading ? t("register_loading") : t("register_submit")}
        </button>
        {error && <div className="register-error">{error}</div>}
      </form>
      <div className="register-login-link">
        {t("register_has_account")}{" "}
        <a href="/login">{t("register_to_login")}</a>
      </div>
    </div>
  );
};

export default RegisterPage;
