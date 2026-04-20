import { useState } from "react";
import styles from "./ChangePassword_Form.module.css";
import { Eye, EyeOff } from "lucide-react";

export default function ChangePassword() {
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const toggle = (key) => {
    setShow({ ...show, [key]: !show[key] });
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Đổi mật khẩu</h2>

      <div className={styles.divider} />

      {/* current password */}
      <div className={styles.row}>
        <label>Mật khẩu hiện tại</label>
        <div className={styles.inputWrap}>
          <input
            type={show.current ? "text" : "password"}
            placeholder="Nhập mật khẩu"
          />
          <button
            type="button"
            onClick={() => toggle("current")}
            className={styles.eye}
          >
            {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* new password */}
      <div className={styles.row}>
        <label>Mật khẩu mới</label>
        <div className={styles.inputWrap}>
          <input
            type={show.newPass ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
          />
          <button
            type="button"
            onClick={() => toggle("newPass")}
            className={styles.eye}
          >
            {show.newPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* confirm */}
      <div className={styles.row}>
        <label>Nhập lại mật khẩu mới</label>
        <div className={styles.inputWrap}>
          <input
            type={show.confirm ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
          />
          <button
            type="button"
            onClick={() => toggle("confirm")}
            className={styles.eye}
          >
            {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button className={styles.submit}>Cập nhật mật khẩu</button>
    </div>
  );
}
