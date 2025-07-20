import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError(t("register.enter_username_password"));
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
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("register.failed"));
      } else {
        setSuccess(t("register.success"));
        setTimeout(() => navigate("/login"), 3000);
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
        {success && <div className="register-success">{success}</div>}
      </form>
      <div className="register-login-link">
        {t("register_has_account")}{" "}
        <a href="/login">{t("register_to_login")}</a>
      </div>
    </div>
  );
};

export default RegisterPage;
