import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const USER_KEY = "eatwhat_user";
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = process.env.REACT_APP_API_URL || "https://api.randomeatwhat.com";

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setCaptchaError("");

    if (captchaInput.trim().toUpperCase() !== captcha) {
      setCaptchaError(t("captcha_wrong"));
      handleRefreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErr(data.error || t("login_failed"));
        setLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({ username: data.username })
      );
      navigate("/");
    } catch (e) {
      setErr(t("login_failed"));
    }
    setLoading(false);
  }

  const handleRegister = () => navigate("/register");

  return (
    <div className="app-container login-page">
      <div className="back-link-row">
        <Link to="/" className="back-link">
          {t("back_home")}
        </Link>
      </div>
      <h2 className="login-title">{t("login_title")}</h2>
      <form onSubmit={handleLogin}>
        <div className="login-field">
          <input
            type="text"
            className="login-input"
            placeholder={t("login_username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="login-field">
          <input
            type="password"
            className="login-input"
            placeholder={t("login_password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {/* 验证码区块 */}
        <div className="captcha-row">
          <input
            type="text"
            className="captcha-input"
            placeholder={t("captcha_placeholder")}
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            maxLength={4}
          />
          <span
            className="captcha-code"
            onClick={handleRefreshCaptcha}
            title={t("captcha_refresh")}
          >
            {captcha}
          </span>
        </div>
        {captchaError && <div className="error-msg">{captchaError}</div>}
        {err && <div className="error-msg">{err}</div>}
        <div className="login-actions">
          <button type="submit" className="button-main" disabled={loading}>
            {loading ? t("loading") : t("login")}
          </button>
          <button
            type="button"
            className="button-main"
            onClick={handleRegister}
          >
            {t("register")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
