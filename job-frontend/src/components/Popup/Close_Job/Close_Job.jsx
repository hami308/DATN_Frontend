import React from "react";
import styles from "./Close_Job.module.css";

const Close_Job = ({ onCancel, onConfirm }) => {
  return (
    <div className={styles.jobConfirmOverlay}>
      <div className={styles.jobConfirmContainer}>
        <h2 className={styles.jobConfirmTitle}>XÁC NHẬN ĐÓNG TIN</h2>
        <div className={styles.jobConfirmContent}>
          <p><strong>Tên vị trí:</strong> Senior UX Designer</p>
          <p><strong>Địa điểm:</strong> 184 Tố Hữu, Hòa Cường, Đà Nẵng</p>
          <p><strong>Cấp bậc:</strong> Senior</p>
          <p><strong>Mức lương:</strong> 10–20 triệu VNĐ</p>
          <p><strong>Số lượng cần tuyển:</strong> 2</p>
          <p><strong>Thời gian hết hạn:</strong> 30/4/2026 (Còn 25 ngày)</p>
        </div>
        <div className={styles.jobConfirmActions}>
          <button className={styles.jobConfirmCancel} onClick={onCancel}>
            Hủy bỏ
          </button>
          <button className={styles.jobConfirmSubmit} onClick={onConfirm}>
            Đóng tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Close_Job;
