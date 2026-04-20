import { useRef, useState } from "react";
import styles from "./ProfileForm.module.css";

export default function ProfileForm() {
  const fileRef = useRef();
  const [avatar, setAvatar] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    fileRef.current.value = "";
  };

  return (
    <div className={styles.card}>
      {/* header */}
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {avatar ? (
              <img src={avatar} alt="" />
            ) : (
              <div className={styles.placeholder} />
            )}
          </div>

          <button
            className={styles.uploadBtn}
            onClick={() => fileRef.current.click()}
          >
            <span className="material-symbols-outlined">upload</span>
          </button>

          {avatar && (
            <button className={styles.removeBtn} onClick={removeAvatar}>
              ✕
            </button>
          )}

          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={handleUpload}
          />
        </div>

        <div>
          <div className={styles.name}>Nguyễn Hà My</div>
          <div className={styles.email}>nguyenhamy2000.td@gmail.com</div>
        </div>
      </div>

      {/* divider */}
      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Họ và tên</span>
        <span>Nguyễn Hà My</span>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Email</span>
        <span>nguyenhamy2000.td@gmail.com</span>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Số điện thoại</span>
        <span>Nhập số điện thoại</span>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Địa chỉ</span>
        <span>Nhập địa chỉ</span>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Giới tính</span>
        <div className={styles.gender}>
          <label>
            <input type="radio" name="gender" /> Nam
          </label>
          <label>
            <input type="radio" name="gender" /> Nữ
          </label>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Ngày sinh</span>
        <span>dd/mm/yyyy</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.save}>Lưu</button>
      </div>
    </div>
  );
}
