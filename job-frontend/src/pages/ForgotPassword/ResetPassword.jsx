import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormLayout from "../../components/formLayout/formLayout";
import styles from "../verifyAccount/components/verify.module.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = useMemo(() => {
    return (
      location.state?.email ||
      sessionStorage.getItem("forgot_password_email") ||
      ""
    );
  }, [location.state?.email]);
  const otp = useMemo(() => {
    return (
      location.state?.otp ||
      sessionStorage.getItem("forgot_password_otp") ||
      ""
    );
  }, [location.state?.otp]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = () => {
    setMessage("");
    setError("");

    if (!email || !otp) {
      setError("Phiên đặt lại mật khẩu không hợp lệ. Vui lòng thử lại.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ mật khẩu mới.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    sessionStorage.removeItem("forgot_password_email");
    sessionStorage.removeItem("forgot_password_otp");
    setPassword("");
    setConfirmPassword("");
    setMessage("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.");
  };

  return (
    <FormLayout>
      <div className={styles.content}>
        <h2 className={styles.title}>Tạo mật khẩu mới</h2>

        <p className={styles.desc}>
          Nhập mật khẩu mới cho tài khoản {email || "của bạn"}.
        </p>

        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
            setMessage("");
          }}
          placeholder="Nhập mật khẩu mới"
          className={styles.input}
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            setError("");
            setMessage("");
          }}
          placeholder="Nhập lại mật khẩu mới"
          className={styles.input}
        />

        {message && <p className={styles.success}>{message}</p>}

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="button"
          className={styles.button}
          onClick={handleResetPassword}
        >
          Cập nhật mật khẩu
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
