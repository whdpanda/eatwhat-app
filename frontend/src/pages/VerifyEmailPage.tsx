import React from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import EmailVerificationForm from "../components/EmailVerificationForm";

const VerifyEmailPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";

  return (
    <div className="verify-container">
      <h2 className="verify-title">{t("verify_email_title")}</h2>
      <EmailVerificationForm defaultEmail={defaultEmail} />
    </div>
  );
};

export default VerifyEmailPage;
