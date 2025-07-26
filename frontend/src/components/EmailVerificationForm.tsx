import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
const API_URL = process.env.REACT_APP_API_URL || "https://api.randomeatwhat.com";

type EmailVerificationFormProps = {
  defaultEmail?: string;      // 可选，预填邮箱
  onSuccess?: () => void;     // 验证成功后的回调
  className?: string;
};

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  defaultEmail = "",
  onSuccess,
  className = "",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [disabled, setDisabled] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !code) {
      setError(t("verify.enter_email_and_code"));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t("register.invalid_email"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("verify.failed"));
      } else {
        setSuccess(t("verify.success"));
        setDisabled(true);
        // 回调或自动跳转
        if (onSuccess) {
          onSuccess();
        } else {
          setTimeout(() => navigate("/login"), 3000);
        }
      }
    } catch {
      setError(t("verify.network_error"));
    }
    setLoading(false);
  };

  // 你可以实现一个 resend 验证码的功能（这里仅占位，需后端支持）
  // const handleResend = async () => { ... };

  return (
    <form className={`email-verification-form ${className}`} onSubmit={handleSubmit}>
      <input
        className="verify-input"
        type="email"
        placeholder={t("register_email")}
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoFocus={!defaultEmail}
        disabled={!!defaultEmail}
      />
      <input
        className="verify-input"
        type="text"
        placeholder={t("verify_input_code")}
        value={code}
        onChange={e => setCode(e.target.value)}
        disabled={disabled}
      />
      <button
        className="verify-button"
        type="submit"
        disabled={loading || disabled}
      >
        {loading ? t("verify.loading") : t("verify_submit")}
      </button>
      {/* <button type="button" className="resend-btn" onClick={handleResend} disabled={loading}>
        {t("verify.resend_code")}
      </button> */}
      {error && <div className="verify-error">{error}</div>}
      {success && (
        <div className="verify-success">
          {success}
          <br />
          {t("verify.success_to_login")}
        </div>
      )}
    </form>
  );
};

export default EmailVerificationForm;
