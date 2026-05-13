import styles from "./login.module.css";
import logo from "../../assets/image/logo.png";
import pic2 from "../../assets/image/pic2.png";
import pic3 from "../../assets/image/pic3.png";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // =========================
  // MOCK DATA
  // =========================
  const mockUsers = [
    {
      email: "candidate@gmail.com",
      password: "123456",
      role: "candidate",
    },
    {
      email: "recruiter@gmail.com",
      password: "123456",
      role: "recruiter",
    },
  ];

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleLogin = () => {
    setError("");

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Sai email hoặc mật khẩu!");
      return;
    }

    // lưu mock user vào localStorage
    localStorage.setItem("user", JSON.stringify(user));

    // điều hướng theo role
    if (user.role === "candidate") {
      navigate("/home-candidate");
    } else if (user.role === "recruiter") {
      navigate("/manage-recruitment");
    }
  };

  return (
    <div className={styles.container}>
      <img src={pic2} className={styles.pic1} alt="" />
      <img src={pic3} className={styles.pic3} alt="" />

      <div className={styles.card}>
        {/* LOGO */}
        <div className={styles.logo}>
          <img src={logo} className={styles.logoIcon} alt="" />
          <span>MyCV</span>
        </div>

        {/* TITLE */}
        <h2 className={styles.title}>Đăng nhập</h2>

        {/* FORM */}
        <div className={styles.form}>
          <label>Email</label>

          <input
            type="text"
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Mật khẩu</label>

          <input
            type="password"
            placeholder="abc@123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className={styles.forgot}>Quên mật khẩu ?</div>

          {/* ERROR */}
          {error && <p className={styles.error}>{error}</p>}

          {/* LOGIN BUTTON */}
          <button className={styles.loginBtn} onClick={handleLogin}>
            Đăng nhập
          </button>

          <div className={styles.or}>hoặc tiếp tục với</div>

          {/* GOOGLE */}
          <button className={styles.googleBtn}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt=""
            />
          </button>

          {/* REGISTER */}
          <div className={styles.register}>
            Bạn chưa có tài khoản ?
            <span onClick={() => navigate("/registerChoice")}>
              {" "}
              Đăng ký ngay
            </span>
          </div>
        </div>

        {/* BACK */}
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Quay lại
        </button>
      </div>
    </div>
  );
}