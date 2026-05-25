import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ProfileForm.module.css";

import {
  getRecruiterInfor,
  updateRecruiterInfor,
  getRecruiterDetailApi,
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

const isAtLeast18YearsOld = (value) => {
  if (!value) return false;

  const birthDate = parseDisplayDate(value);
  if (!birthDate) return false;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
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

  if (name === "date_of_birth") {
    if (!text) return "Vui lòng chọn ngày sinh";

    if (!parseDisplayDate(text)) {
      return "Ngày sinh không hợp lệ";
    }

    if (!isAtLeast18YearsOld(text)) {
      return "Bạn phải đủ 18 tuổi";
    }
  }

  return "";
};

const validateForm = (formData) => {
  const newErrors = {};

  ["full_name", "phone", "date_of_birth"].forEach((field) => {
    const error = validateField(field, formData[field]);

    if (error) {
      newErrors[field] = error;
    }
  });

  return newErrors;
};

export default function ProfileForm({ profileId }) {
  const fileRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";
  const canShowCompany = isAdmin || isRecruiter;

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    gender: "",
    date_of_birth: "",
    company_name: "",
    is_verify_phone: false,
  });

  const checkUser = () => {
    if (!user) {
      return {
        valid: false,
        message: "Bạn chưa đăng nhập.",
        user: null,
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
      email: recruiter?.email || user?.email || "",
      phone: recruiter?.phone || "",
      location: recruiter?.location || "",
      gender:
        recruiter?.gender === true
          ? "male"
          : recruiter?.gender === false
          ? "female"
          : "",
      date_of_birth: formatDateForDisplay(recruiter?.date_of_birth),
      company_name:
        recruiter?.company_name ||
        recruiter?.company?.name ||
        recruiter?.name_company ||
        recruiter?.companyName ||
        "Chưa cập nhật công ty",
      is_verify_phone: Boolean(recruiter?.is_verify_phone),
    });
  };

  const fetchLatestRecruiter = async (user) => {
    let response;

    if (profileId) {
      response = await getRecruiterDetailApi(profileId);
    } else {
      response = await getRecruiterInfor();
    }

    const recruiter = getRecruiterFromResponse(response);
    console.log("Fetched recruiter:", recruiter);

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

        const result = checkUser();

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
  }, [profileId]);

  const handleChange = (e) => {
    if (isAdmin) return;

    const { name, value } = e.target;

    if (name === "email" || name === "company_name") return;

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
    if (isAdmin) return;

    const formattedDate = formatDateFromPicker(date);

    setFormData((prev) => ({
      ...prev,
      date_of_birth: formattedDate,
    }));

    setErrors((prev) => ({
      ...prev,
      date_of_birth: validateField("date_of_birth", formattedDate),
    }));

    setMessage("");
    setError("");
  };

  const handleUpload = (e) => {
    if (isAdmin) return;

    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
    setMessage("");
    setError("");
  };

  const removeAvatar = () => {
    if (isAdmin) return;

    setAvatar(null);
    setAvatarFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    if (isAdmin) return;

    const result = checkUser();

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

      dataUpdate.append("is_verify_phone", String(formData.is_verify_phone));

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

          {!isAdmin && (
            <>
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
            </>
          )}
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
            readOnly={isAdmin}
            placeholder="Nhập họ và tên"
            className={errors.full_name ? styles.inputError : styles.nameInput}
          />

          {errors.full_name && (
            <p className={styles.fieldError}>{errors.full_name}</p>
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
            className={`${styles.readOnlyInput} ${styles.nameInput}`}
            placeholder="Email"
          />
        </div>
      </div>

      {canShowCompany && (
        <>
          <div className={styles.divider}></div>

          <div className={styles.row}>
            <span>Công ty</span>

            <div className={styles.field}>
              <input
                name="company_name"
                value={formData.company_name}
                readOnly
                className={`${styles.readOnlyInput} ${styles.nameInput}`}
                placeholder="Công ty"
              />
            </div>
          </div>
        </>
      )}

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Số điện thoại</span>

        <div className={styles.field}>
          <div className={styles.phoneValue}>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              readOnly={isAdmin}
              placeholder="Nhập số điện thoại"
              className={errors.phone ? styles.inputError : ""}
            />

            {!isAdmin && (
              <Link
                to={formData.is_verify_phone ? "#" : "/verify-phone"}
                onClick={(e) => {
                  if (formData.is_verify_phone) {
                    e.preventDefault();
                  }
                }}
                className={
                  formData.is_verify_phone
                    ? styles.verifyPhoneLinkDisabled
                    : styles.verifyPhoneLink
                }
                title={
                  formData.is_verify_phone
                    ? "Số điện thoại đã được xác thực"
                    : "Xác thực số điện thoại"
                }
                aria-label={
                  formData.is_verify_phone
                    ? "Số điện thoại đã được xác thực"
                    : "Xác thực số điện thoại"
                }
              >
                <span className="material-symbols-outlined">check_circle</span>
              </Link>
            )}
          </div>

          {errors.phone && <p className={styles.fieldError}>{errors.phone}</p>}
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
            readOnly={isAdmin}
            className={styles.nameInput}
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
              disabled={isAdmin}
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
              disabled={isAdmin}
            />
            Nữ
          </label>
        </div>
      </div>

      <div className={styles.divider}></div>

      <div className={styles.row}>
        <span>Ngày sinh</span>

        <div className={styles.field}>
          <DatePicker
            selected={parseDisplayDate(formData.date_of_birth)}
            onChange={handleDateChange}
            disabled={isAdmin}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/yyyy"
            className={`${styles.dateInput} ${
              errors.date_of_birth ? styles.inputError : ""
            }`}
            wrapperClassName={styles.datePickerWrapper}
            popperPlacement="bottom-end"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            maxDate={new Date()}
          />

          {errors.date_of_birth && (
            <p className={styles.fieldError}>{errors.date_of_birth}</p>
          )}
        </div>
      </div>

      {message && <p className={styles.success}>{message}</p>}

      {error && <p className={styles.error}>{error}</p>}

      {!isAdmin && (
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
      )}
    </div>
  );
}