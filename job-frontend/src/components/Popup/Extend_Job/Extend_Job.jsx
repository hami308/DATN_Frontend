import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Extend_Job.module.css";

const Extend_Job = ({ onCancel, onConfirm }) => {
  const [extendDate, setExtendDate] = useState(null);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>XÁC NHẬN GIA HẠN TIN</h2>

        <div className={styles.grid}>
          <span>Tên vị trí</span>
          <p>Senior UX Designer</p>

          <span>Địa điểm</span>
          <p>184 Tố Hữu, Hòa Cường, Đà Nẵng</p>

          <span>Cấp bậc</span>
          <p>Senior</p>

          <span>Mức lương</span>
          <p>10–20 triệu VNĐ</p>

          <span>Số lượng cần tuyển</span>
          <p>2</p>

          <span>Thời gian hết hạn</span>
          <p>30/4/2026 (Còn 25 ngày)</p>

          <span>Gia hạn đến</span>
          <div className={styles.extend_date}>
            <DatePicker
              selected={extendDate}
              onChange={(date) => setExtendDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              className={styles.dateInput}
              minDate={new Date()} // không chọn ngày quá khứ
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Hủy bỏ
          </button>
          <button
            className={styles.submit}
            onClick={() => onConfirm(extendDate)}
          >
            Gia hạn
          </button>
        </div>
      </div>
    </div>
  );
};

export default Extend_Job;