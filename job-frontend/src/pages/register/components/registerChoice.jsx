import styles from "./registerChoice.module.css";
import recruiter from "../../../assets/image/pic1.png";
import candidate from "../../../assets/image/pic2.png";
import { useNavigate } from "react-router-dom";
export default function RegisterChoice() {
  const navigate = useNavigate();
  return (
    <>
      <p className={styles.desc}>
        Chào mừng bạn đến với MyCV. Vui lòng chọn nhóm phù hợp với bạn
      </p>

      <div className={styles.options}>
        <div className={styles.option}>
          <img src={recruiter} />
          <span onClick={() => navigate("/register/recruiter")}>
            Nhà tuyển dụng
          </span>
        </div>

        <div className={styles.option}>
          <img src={candidate} />
          <span onClick={() => navigate("/register/candidate")}>
            Ứng viên tìm việc
          </span>
        </div>
      </div>

      <div className={styles.login}>
        Bạn đã có tài khoản?{" "}
        <span onClick={() => navigate("/login")}>Đăng nhập</span>
      </div>
    </>
  );
}
