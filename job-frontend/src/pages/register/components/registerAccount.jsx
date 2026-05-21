import { useState } from "react";
import styles from "./registerAccount.module.css";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../../service/auth/register";

export default function RegisterAccount({ role }) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ERROR MESSAGE
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setError("");

      if (!fullName || !email || !password || !confirmPassword) {
        setError("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      // FULL NAME
      if (fullName.trim().length < 3) {
        setError("Họ và tên phải có ít nhất 3 ký tự");
        return;
      }

      // PASSWORD
      if (password.length < 8) {
        setError("Mật khẩu phải có ít nhất 8 ký tự");
        return;
      }

      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return;
      }

      const result = await registerApi({
        fullName,
        email,
        password,
        role,
      });

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      alert("Bạn đã đăng ký thành công tài khoản. Vui lòng đăng nhập");

      navigate("/login");
    } catch (error) {
      setError(
        error.message ||
        "Đăng ký thất bại"
      );
    }
  };
  return (
    <>
      <h2 className={styles.title}>
        Đăng ký tài khoản{" "}
        {role === "recruiter" ? "nhà tuyển dụng" : "ứng viên "}
      </h2>

      <div className={styles.form}>
        {/* HIỂN THỊ ERROR */}
        {error && <div className={styles.error}>{error}</div>}

        <label>
          Họ và tên <span>*</span>
        </label>
        <input
          type="text"
          placeholder="Nhập họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label>
          Email <span>*</span>
        </label>
        <input
          type="email"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className={styles.row}>
          <div className={styles.col}>
            <label>
              Mật khẩu <span>*</span>
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.col}>
            <label>
              Xác nhận mật khẩu <span>*</span>
            </label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button className={styles.submit} onClick={handleRegister}>
          Đăng ký
        </button>

        <div className={styles.login}>
          Bạn đã có tài khoản ?
          <span onClick={() => navigate("/login")}> Đăng nhập</span>
        </div>

        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>
    </>
  );
}
