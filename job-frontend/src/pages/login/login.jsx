import styles from "./login.module.css";
import logo from "../../assets/image/logo.png";
import pic2 from "../../assets/image/pic2.png";
import pic3 from "../../assets/image/pic3.png";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginApi } from "../../service/auth/login";
import { getPublicFileUrl } from "../../service/storage/public_file_upload";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");

      if (!email || !password) {
        setError("Vui lòng nhập email và mật khẩu");
        return;
      }

      setLoading(true);

      const result = await loginApi({
        email,
        password,
      });
      const user = result?.data?.user;
      const token = result?.data?.token;

      if (!user || !token) {
        setError("Dữ liệu đăng nhập không hợp lệ");
        return;
      }

      const normalizedUser = {
        ...user,
        avatar: getPublicFileUrl(user.avatar),
      };

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(normalizedUser));

      if (user.role === "candidate") {
        navigate("/home-candidate");
      } else if (user.role === "recruiter") {
        navigate("/manage-recruitment");
      } else if (user.role === "admin") {
        navigate("/home-admin");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Đăng nhập thất bại",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <img src={pic2} className={styles.pic1} alt="" />
      <img src={pic3} className={styles.pic3} alt="" />

      <div className={styles.card}>
        <div className={styles.logo}>
          <img src={logo} className={styles.logoIcon} alt="" />
          <span>MyCV</span>
        </div>

        <h2 className={styles.title}>Đăng nhập</h2>

        <div className={styles.form}>
          <label>Email</label>

          <input
            type="text"
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Mật khẩu</label>

          <div className={styles.passwordField}>
            <input
              className={styles.passwordInput}
              type={showPassword ? "text" : "password"}
              placeholder="abc@123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "An mat khau" : "Hien mat khau"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="button"
            className={styles.forgot}
            onClick={() => navigate("/forgot-password")}
          >
            Quên mật khẩu ?
          </button>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.loginBtn}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className={styles.or}>hoặc tiếp tục với</div>

          <button className={styles.googleBtn}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt=""
            />
          </button>

          <div className={styles.register}>
            Bạn chưa có tài khoản ?
            <span onClick={() => navigate("/registerChoice")}>
              {" "}
              Đăng ký ngay
            </span>
          </div>
        </div>

        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Quay lại
        </button>
      </div>
    </div>
  );
}
