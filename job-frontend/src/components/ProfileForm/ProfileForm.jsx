import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ProfileForm.module.css";

const formatDateForDisplay = (value) => {
  if (!value) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;

  const [datePart] = value.split("T");
  const isoDate = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!isoDate) return value;

  return `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}`;
};

const formatDateFromPicker = (date) => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const parseDisplayDate = (value) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value || "")) return null;

  const [day, month, year] = value.split("/").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

export default function ProfileForm({ recruiter }) {
  const fileRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email || "";

  const [avatar, setAvatar] = useState(recruiter?.avatar || null);

  const [formData, setFormData] = useState({
    full_name: recruiter?.full_name || "",
    email: userEmail,
    phone: recruiter?.phone || "",
    location: recruiter?.location || "",
    gender:
      recruiter?.gender === true
        ? "male"
        : recruiter?.gender === false
        ? "female"
        : "",
    date_of_birth: formatDateForDisplay(recruiter?.date_of_birth),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") return;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date_of_birth: formatDateFromPicker(date),
    });
  };

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

  const handleSave = () => {
    console.log("Dữ liệu lưu:", {
      ...formData,
      avatar,
    });
  };

  return (
    <div className={styles.card}>
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
            type="button"
            className={styles.uploadBtn}
            onClick={() => fileRef.current.click()}
          >
            <span className="material-symbols-outlined">upload</span>
          </button>

          {avatar && (
            <button
              type="button"
              className={styles.removeBtn}
              onClick={removeAvatar}
            >
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
          <div className={styles.name}>
            {formData.full_name || "Chưa cập nhật tên"}
          </div>

          <div className={styles.email}>
            {formData.email || "Chưa cập nhật email"}
          </div>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Họ và tên</span>
        <input
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Nhập họ và tên"
        />
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Email</span>
        <input
          name="email"
          value={formData.email}
          readOnly
          className={styles.readOnlyInput}
          placeholder="Email"
        />
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Số điện thoại</span>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Nhập số điện thoại"
        />
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Địa chỉ</span>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Nhập địa chỉ"
        />
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Giới tính</span>

        <div className={styles.gender}>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
            />
            Nam
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />
            Nữ
          </label>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Ngày sinh</span>
        <DatePicker
          selected={parseDisplayDate(formData.date_of_birth)}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          className={styles.dateInput}
          wrapperClassName={styles.datePickerWrapper}
          popperPlacement="bottom-end"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.save} onClick={handleSave}>
          Lưu
        </button>
      </div>
    </div>
  );
}
