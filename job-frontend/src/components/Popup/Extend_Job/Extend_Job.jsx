import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Extend_Job.module.css";

const getRows = (job) => [
  ["Tên vị trí", job?.title],
  ["Địa điểm", job?.location],
  ["Cấp bậc", job?.level],
  ["Mức lương", job?.salary],
  ["Số lượng cần tuyển", job?.candidateNumber],
  ["Thời gian hết hạn", job?.expireText],
];

const getMinExtendDate = (expire) => {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (!expire) return tomorrow;

  const expireDate = new Date(expire);

  if (Number.isNaN(expireDate.getTime())) return tomorrow;

  expireDate.setHours(0, 0, 0, 0);
  expireDate.setDate(expireDate.getDate() + 1);

  return expireDate > tomorrow ? expireDate : tomorrow;
};

const Extend_Job = ({ job, onCancel, onConfirm }) => {
  const [extendDate, setExtendDate] = useState(null);
  const minExtendDate = useMemo(() => getMinExtendDate(job?.expire), [job]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>XÁC NHẬN GIA HẠN TIN</h2>

        <div className={styles.grid}>
          {getRows(job).map(([label, value]) => (
            <React.Fragment key={label}>
              <span>{label}</span>
              <p>{value || "Chưa cập nhật"}</p>
            </React.Fragment>
          ))}

          <span>Gia hạn đến</span>
          <div className={styles.extend_date}>
            <DatePicker
              selected={extendDate}
              onChange={(date) => setExtendDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              className={styles.dateInput}
              minDate={minExtendDate}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Hủy bỏ
          </button>
          <button
            className={styles.submit}
            disabled={!extendDate}
            onClick={() => onConfirm?.(extendDate, job)}
          >
            Gia hạn
          </button>
        </div>
      </div>
    </div>
  );
};

export default Extend_Job;
