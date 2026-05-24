import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../../components/formLayout/formLayout";
import {
  checkEmailRegistered,
  requestEmailOtp,
} from "../../service/auth/email_verification";
import styles from "../verifyAccount/components/verify.module.css";

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    error?.data?.message ||
    fallback
  );
};

const hasRegisteredEmail = (response) => {
  const data = response?.data || response;
  const registered =
    data?.exists ??
    data?.isRegistered ??
    data?.registered ??
    data?.hasAccount ??
    data?.isExist ??
    data?.is_exists;

  return registered !== false;
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setError("");

    if (!normalizedEmail) {
      setError("Vui lòng nhập email của bạn.");
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      setError("Email không đúng định dạng.");
      return;
    }

    try {
      setSending(true);
      const checkResponse = await checkEmailRegistered(normalizedEmail);

      if (!hasRegisteredEmail(checkResponse)) {
        setError("Email này chưa được đăng ký tài khoản.");
        return;
      }

      await requestEmailOtp(normalizedEmail);

      sessionStorage.setItem("forgot_password_email", normalizedEmail);
      sessionStorage.removeItem("forgot_password_otp");

      navigate("/forgot-password/otp", {
        state: { email: normalizedEmail },
      });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Không thể kiểm tra email hoặc gửi mã OTP. Vui lòng thử lại."
        )
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <FormLayout>
      <div className={styles.content}>
        <h2 className={styles.title}>Quên mật khẩu</h2>

        <p className={styles.desc}>
          Nhập địa chỉ email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.
        </p>

        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
          }}
          placeholder="Nhập email của bạn"
          className={styles.input}
          disabled={sending}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="button"
          className={styles.button}
          onClick={handleSubmit}
          disabled={sending}
        >
          {sending ? "Đang gửi mã..." : "Gửi yêu cầu"}
        </button>

        <button
          type="button"
          className={styles.closeButton}
          onClick={() => navigate("/login")}
        >
          Quay lại đăng nhập
        </button>
      </div>
    </FormLayout>
  );
}
