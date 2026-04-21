import styles from "./searchBar.module.css";

export default function SearchBar() {
  const role="recuiter";
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBar}>
        {/* Danh mục nghề */}
        <select className={styles.select}>
          <option>Danh mục nghề</option>
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>UI/UX Designer</option>
        </select>

        {/* input tìm kiếm */}
        <div className={styles.inputBox}>
          <div className={styles.icon}>
            {" "}
            <span className="material-symbols-outlined">search</span>
          </div>
          <input placeholder="Vị trí tuyển dụng" />
        </div>

        {/* Địa điểm */}
        {role === "candidate" ? (
          <select className={styles.select}>
            <option>Địa điểm</option>
            <option>Hà Nội</option>
            <option>Đà Nẵng</option>
            <option>TP HCM</option>
          </select>
        ):(
          <select className={styles.select}>
            <option>Đang ứng tuyển</option>
            <option>Chưa hiển thị</option>
            <option>Đã hết hạn</option>
            <option>Đã đóng</option>
          </select>
        )}
        

        <button className={styles.btn}>Tìm kiếm</button>
      </div>
    </div>
  );
}
