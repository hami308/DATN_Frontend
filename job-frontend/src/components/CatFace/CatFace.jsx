import styles from "./CatFace.module.css";
import avatar from "../../assets/image/cat.png";

export default function CatFace() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bubble}>
        <span>Tìm kiếm việc làm ngay nào !</span>
        <div className={styles.arrow}></div>
      </div>

      <img src={avatar} alt="avatar" className={styles.avatar} />
    </div>
  );
}
