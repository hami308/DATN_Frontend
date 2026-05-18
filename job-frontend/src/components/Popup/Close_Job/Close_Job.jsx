import React from "react";
import styles from "./Close_Job.module.css";

const getRows = (job) => [
  ["Tên vị trí", job?.title],
  ["Địa điểm", job?.location],
  ["Cấp bậc", job?.level],
  ["Mức lương", job?.salary],
  ["Số lượng cần tuyển", job?.candidateNumber],
  ["Thời gian hết hạn", job?.expireText],
];

const Close_Job = ({ job, onCancel, onConfirm }) => {
  return (
    <div className={styles.jobConfirmOverlay}>
      <div className={styles.jobConfirmContainer}>
        <h2 className={styles.jobConfirmTitle}>XÁC NHẬN ĐÓNG TIN</h2>

        <div className={styles.jobConfirmContent}>
          {getRows(job).map(([label, value]) => (
            <p key={label}>
              <strong>{label}:</strong> {value || "Chưa cập nhật"}
            </p>
          ))}
        </div>

        <div className={styles.jobConfirmActions}>
          <button className={styles.jobConfirmCancel} onClick={onCancel}>
            Hủy bỏ
          </button>
          <button
            className={styles.jobConfirmSubmit}
            onClick={() => onConfirm?.(job)}
          >
            Đóng tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Close_Job;
