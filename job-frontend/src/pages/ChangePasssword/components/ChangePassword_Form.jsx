import { useState } from "react";
import styles from "./ChangePassword_Form.module.css";
import { Eye, EyeOff } from "lucide-react";
import { changpasswordApi } from "../../../service/auth/change_pasword";

export default function ChangePassword() {
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [apiError, setApiError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = (key) => {
    setShow((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const validateField = (name, value, data = formData) => {
    let error = "";

    if (name === "currentPassword") {
      if (!value.trim()) {
        error = "Vui lòng nhập mật khẩu hiện tại.";
      }
    }

    if (name === "newPassword") {
      if (!value.trim()) {
        error = "Vui lòng nhập mật khẩu mới.";
      } else if (value.length < 8) {
        error = "Mật khẩu mới phải có tối thiểu 8 ký tự.";
      }
    }

    if (name === "confirmPassword") {
      if (!value.trim()) {
        error = "Vui lòng nhập lại mật khẩu.";
      } else if (value !== data.newPassword) {
        error = "Mật khẩu xác nhận không khớp.";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);
    setApiError("");
    setMessage("");

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "newPassword" && prev.confirmPassword
        ? {
            confirmPassword: validateField(
              "confirmPassword",
              newFormData.confirmPassword,
              newFormData
            ),
          }
        : {}),
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: validateField(
        "currentPassword",
        formData.currentPassword
      ),
      newPassword: validateField(
        "newPassword",
        formData.newPassword
      ),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };

    setErrors(newErrors);

    return (
      !newErrors.currentPassword &&
      !newErrors.newPassword &&
      !newErrors.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setMessage("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await changpasswordApi({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage(response.message || "Đổi mật khẩu thành công.");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setApiError(
        err.message ||
          "Đổi mật khẩu thất bại. Vui lòng thử lại."
      );

      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Đổi mật khẩu</h2>

      <div className={styles.divider} />

      <div className={styles.row}>
        <label>Mật khẩu hiện tại</label>

        <div className={styles.inputWrap}>
          <input
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            type={show.current ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            className={
              errors.currentPassword ? styles.inputError : ""
            }
          />

          <button
            type="button"
            onClick={() => toggle("current")}
            className={styles.eye}
          >
            {show.current ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {errors.currentPassword && (
        <p className={styles.error}>
          {errors.currentPassword}
        </p>
      )}

      <div className={styles.row}>
        <label>Mật khẩu mới</label>

        <div className={styles.inputWrap}>
          <input
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            type={show.newPass ? "text" : "password"}
            placeholder="Nhập mật khẩu mới"
            className={errors.newPassword ? styles.inputError : ""}
          />

          <button
            type="button"
            onClick={() => toggle("newPass")}
            className={styles.eye}
          >
            {show.newPass ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {errors.newPassword && (
        <p className={styles.error}>
          {errors.newPassword}
        </p>
      )}

      <div className={styles.row}>
        <label>Nhập lại mật khẩu mới</label>

        <div className={styles.inputWrap}>
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            type={show.confirm ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            className={
              errors.confirmPassword ? styles.inputError : ""
            }
          />

          <button
            type="button"
            onClick={() => toggle("confirm")}
            className={styles.eye}
          >
            {show.confirm ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {errors.confirmPassword && (
        <p className={styles.error}>
          {errors.confirmPassword}
        </p>
      )}

      {message && (
        <p className={styles.success}>{message}</p>
      )}

      {apiError && (
        <p className={styles.errorCenter}>{apiError}</p>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={loading}
      >
        {loading
          ? "Đang cập nhật..."
          : "Cập nhật mật khẩu"}
      </button>
    </form>
  );
}