import styles from "./registerAccount.module.css";
import { useNavigate } from "react-router-dom";

export default function RegisterAccount({ role }) {
  const navigate = useNavigate();
  return (
    <>
      <h2 className={styles.title}>
        Đăng ký tài khoản{" "}
        {role === "recruiter" ? "nhà tuyển dụng" : "ứng viên "}
      </h2>

      <div className={styles.form}>
        <label>
          Họ và tên <span>*</span>
        </label>
        <input type="text" placeholder="Nhập họ và tên" />

        <label>
          Email <span>*</span>
        </label>
        <input type="email" placeholder="Nhập email" />

        <div className={styles.row}>
          <div className={styles.col}>
            <label>
              Mật khẩu <span>*</span>
            </label>
            <input type="password" placeholder=" Nhập mật khẩu" />
          </div>

          <div className={styles.col}>
            <label>
              Xác nhận mật khẩu <span>*</span>
            </label>
            <input type="password" placeholder="Xác nhận mật khẩu" />
          </div>
        </div>

        <button className={styles.submit}>Đăng ký</button>

        <div className={styles.login}>
          Bạn đã có tài khoản ?
          <span onClick={() => navigate("/login")}> Đăng nhập</span>
        </div>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/registerChoice")}
        >
          ← Quay lại
        </button>
      </div>
    </>
  );
}
