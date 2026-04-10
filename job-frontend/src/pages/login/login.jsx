import styles from "./login.module.css";
import logo from "../../assets/image/logo.png";
import pic2 from "../../assets/image/pic2.png";
import pic3 from "../../assets/image/pic3.png";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <img src={pic2} className={styles.pic1} />
      <img src={pic3} className={styles.pic3} />
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src={logo} className={styles.logoIcon} />
          <span>MyCV</span>
        </div>

        <h2 className={styles.title}>Đăng nhập</h2>

        <div className={styles.form}>
          <label>Email</label>
          <input type="text" placeholder="username@gmail.com" />

          <label>Mật khẩu</label>
          <input type="password" placeholder="abc@123" />

          <div className={styles.forgot}>Quên mật khẩu ?</div>

          <button className={styles.loginBtn}>Đăng nhập</button>

          <div className={styles.or}>hoặc tiếp tục với </div>

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
      </div>
    </div>
  );
}
