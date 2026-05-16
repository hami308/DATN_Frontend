import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ProfileForm.module.css";

import {
  getRecruiterInfor,
  updateRecruiterInfor,
} from "../../service/recruiter/recruiter_infor";

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

const convertDateToISO = (value) => {
  if (!value) return "";

  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
};

const validateField = (name, value) => {
  const text = value?.trim() || "";

  if (name === "full_name") {
    if (!text) return "Họ và tên không được để trống";
    if (text.length < 3) return "Họ và tên phải có ít nhất 3 ký tự";
  }

  if (name === "phone") {
    if (!text) return "";

    if (!/^(0|\+84)[0-9]{9}$/.test(text)) {
      return "Số điện thoại không hợp lệ";
    }
  }

  return "";
};

const validateForm = (formData) => {
  const newErrors = {};

  ["full_name", "phone"].forEach((field) => {
    const error = validateField(field, formData[field]);

    if (error) {
      newErrors[field] = error;
    }
  });

  return newErrors;
};

export default function ProfileForm() {
  const fileRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    date_of_birth: "",
  });

  const checkRecruiterRole = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return {
        valid: false,
        message: "Bạn chưa đăng nhập.",
        user: null,
      };
    }

    if (user.role !== "recruiter") {
      return {
        valid: false,
        message: "Tài khoản không phải nhà tuyển dụng.",
        user,
      };
    }

    return {
      valid: true,
      message: "",
      user,
    };
  };

  const getRecruiterFromResponse = (response) => {
    return (
      response?.data?.recruiter ||
      response?.recruiter ||
      response?.data ||
      response
    );
  };

  const fillFormData = (recruiter, user) => {
    setAvatar(recruiter?.avatar || null);

    setFormData({
      full_name: recruiter?.full_name || "",
      email: user?.email || "",
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
  };

  const fetchLatestRecruiter = async (user) => {
    const response = await getRecruiterInfor();
    const recruiter = getRecruiterFromResponse(response);

    if (recruiter) {
      fillFormData(recruiter, user);
    }

    return recruiter;
  };

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        setPageLoading(true);
        setMessage("");
        setError("");

        const result = checkRecruiterRole();

        if (!result.valid) {
          setError(result.message);
          return;
        }

        await fetchLatestRecruiter(result.user);
      } catch (err) {
        setMessage("");
        setError(
          err.response?.data?.message ||
            err.message ||
            "Lấy thông tin thất bại."
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchRecruiter();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    setMessage("");
    setError("");
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date_of_birth: formatDateFromPicker(date),
    }));

    setMessage("");
    setError("");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
    setMessage("");
    setError("");
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    const result = checkRecruiterRole();

    if (!result.valid) {
      setMessage("");
      setError(result.message);
      return;
    }

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      setMessage("");
      setError("Vui lòng kiểm tra lại thông tin.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const dataUpdate = new FormData();

      dataUpdate.append("fullName", formData.full_name);
      dataUpdate.append("phone", formData.phone);
      dataUpdate.append("location", formData.location);

      dataUpdate.append(
        "gender",
        formData.gender === "male"
          ? "true"
          : formData.gender === "female"
          ? "false"
          : ""
      );

      dataUpdate.append(
        "dateOfBirth",
        formData.date_of_birth
          ? convertDateToISO(formData.date_of_birth)
          : ""
      );

      if (avatarFile) {
        dataUpdate.append("avatar", avatarFile);
      } else if (avatar === null) {
        dataUpdate.append("removeAvatar", "true");
      }

      const updateResponse = await updateRecruiterInfor(dataUpdate);
      await fetchLatestRecruiter(result.user);

      setAvatarFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      setError("");
      setMessage(
        updateResponse.data.message || "Cập nhật thông tin thành công."
      );
    } catch (err) {
      setMessage("");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Cập nhật thông tin thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            {avatar ? (
              <img src={avatar} alt="avatar" />
            ) : (
              <div className={styles.placeholder} />
            )}
          </div>

          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => fileRef.current?.click()}
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

        <div className={styles.field}>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
            className={errors.full_name ? styles.inputError : ""}
          />

          {errors.full_name && (
            <p className={styles.fieldError}>
              {errors.full_name}
            </p>
          )}
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Email</span>

        <div className={styles.field}>
          <input
            name="email"
            value={formData.email}
            readOnly
            className={styles.readOnlyInput}
            placeholder="Email"
          />
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Số điện thoại</span>

        <div className={styles.field}>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className={errors.phone ? styles.inputError : ""}
          />

          {errors.phone && (
            <p className={styles.fieldError}>{errors.phone}</p>
          )}
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Địa chỉ</span>

        <div className={styles.field}>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
          />
        </div>
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

      {message && <p className={styles.success}>{message}</p>}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.save}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </div>
  );
}