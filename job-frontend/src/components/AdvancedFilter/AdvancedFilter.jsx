import styles from "./advancedFilter.module.css";

export default function AdvancedFilter() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span class="material-symbols-outlined">filter_alt</span>
        <p>Bộ lọc nâng cao</p>
      </div>

      {/* Kinh nghiệm */}
      <div className={styles.section}>
        <h4>Kinh nghiệm</h4>
        <div className={styles.options}>
          <label>
            <input type="radio" name="exp" /> Không yêu cầu
          </label>
          <label>
            <input type="radio" name="exp" /> Tất cả
          </label>
          <label>
            <input type="radio" name="exp" /> 1 năm
          </label>
          <label>
            <input type="radio" name="exp" /> &gt; 5 năm
          </label>
        </div>
      </div>

      {/* Hình thức làm việc */}
      <div className={styles.section}>
        <h4>Hình thức làm việc</h4>
        <div className={styles.options}>
          <label>
            <input type="radio" name="type" /> Parttime
          </label>
          <label>
            <input type="radio" name="type" /> Tất cả
          </label>
          <label>
            <input type="radio" name="type" /> Fulltime
          </label>
          <label>
            <input type="radio" name="type" /> Khác
          </label>
        </div>
      </div>

      {/* Mức lương */}
      <div className={styles.section}>
        <h4>Mức lương</h4>
        <div className={styles.options}>
          <label>
            <input type="radio" name="salary" /> Tất cả
          </label>
          <label>
            <input type="radio" name="salary" /> Dưới 10 triệu
          </label>
          <label>
            <input type="radio" name="salary" /> Trên 15 triệu
          </label>
          <label>
            <input type="radio" name="salary" /> Từ 5-10 triệu
          </label>
        </div>
      </div>

      {/* Cấp bậc */}
      <div className={styles.section}>
        <h4>Cấp bậc</h4>
        <div className={styles.options}>
          <label>
            <input type="radio" name="level" /> Trưởng phòng
          </label>
          <label>
            <input type="radio" name="level" /> Tất cả
          </label>
          <label>
            <input type="radio" name="level" /> Leader
          </label>
          <label>
            <input type="radio" name="level" /> Senior
          </label>
        </div>
      </div>
    </div>
  );
}
