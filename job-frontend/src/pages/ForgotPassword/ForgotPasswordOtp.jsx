import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormLayout from "../../components/formLayout/formLayout";
import {
  requestEmailOtp,
  verifyEmailOtp,
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

export default function ForgotPasswordOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = useMemo(() => {
    return (
      location.state?.email ||
      sessionStorage.getItem("forgot_password_email") ||
      ""
    );
  }, [location.state?.email]);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);

  const handleVerify = async () => {
    const normalizedOtp = otp.trim();

    setError("");
    setMessage("");

    if (!email) {
      setError("Vui lòng nhập email trước khi xác thực OTP.");
      return;
    }

    if (!/^\d{6}$/.test(normalizedOtp)) {
      setError("Mã OTP phải gồm 6 chữ số.");
      return;
    }

    try {
      setVerifying(true);
      await verifyEmailOtp({
        email,
        otp: normalizedOtp,
      });

      sessionStorage.setItem("forgot_password_otp", normalizedOtp);

      navigate("/forgot-password/reset-password", {
        state: {
          email,
          otp: normalizedOtp,
        },
      });
    } catch (err) {
      setError(getErrorMessage(err, "Xác thực OTP thất bại."));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || sending) return;

    try {
      setSending(true);
      setError("");
      setMessage("");
      setOtp("");

      const response = await requestEmailOtp(email);

      setMessage(response?.message || "Đã gửi lại mã OTP đến email của bạn.");
    } catch (err) {
      setError(getErrorMessage(err, "Gửi lại mã OTP thất bại."));
    } finally {
      setSending(false);
    }
  };

  return (
    <FormLayout>
      <div className={styles.content}>
        <h2 className={styles.title}>Nhập mã OTP</h2>

        <p className={styles.desc}>
          Mã OTP đặt lại mật khẩu đã được gửi đến {email || "email của bạn"}.
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(event) => {
            setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
            setError("");
          }}
          placeholder="Nhập mã OTP"
          className={styles.input}
          disabled={verifying || sending}
        />

        {message && <p className={styles.success}>{message}</p>}

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="button"
          className={styles.button}
          onClick={handleVerify}
          disabled={verifying || sending}
        >
          {verifying ? "Đang xác thực..." : "Xác thực OTP"}
        </button>

        <p className={styles.resend}>
          Không nhận được mã{" "}
          <button type="button" onClick={handleResend} disabled={sending}>
            {sending ? "Đang gửi..." : "Gửi lại"}
          </button>
        </p>

        <button
          type="button"
          className={styles.closeButton}
          onClick={() => navigate("/forgot-password")}
        >
          Quay lại nhập email
        </button>
      </div>
    </FormLayout>
  );
}
