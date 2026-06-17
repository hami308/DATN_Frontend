import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./verify.module.css";

import { getRecruiterInfor } from "../../../service/recruiter/recruiter_infor";

import {
  requestPhoneOtp,
  verifyPhoneOtp,
} from "../../../service/auth/phone_verification";

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    error?.data?.message ||
    fallback
  );
};

const getRecruiterFromResponse = (response) => {
  return (
    response?.data?.recruiter ||
    response?.recruiter ||
    response?.data ||
    response
  );
};

export default function VerifyPhoneContent() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const sendOtp = useCallback(async (phoneNumber) => {
    try {
      setSending(true);
      setError("");
      setMessage("");

      const response = await requestPhoneOtp(phoneNumber);
      
      setMessage(
        ""
      );
    } catch (err) {
      setMessage("");
      setError(getErrorMessage(err, "Gửi mã OTP thất bại."));
    } finally {
      setSending(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        setPageLoading(true);
        setError("");
        setMessage("");

        const response = await getRecruiterInfor();
        const recruiter = getRecruiterFromResponse(response);

        if (!recruiter?.phone) {
          setError(
            "Bạn chưa cập nhật số điện thoại. Hãy cập nhật trong hồ sơ trước."
          );
          return;
        }

        setPhone(recruiter.phone);
        setIsVerified(Boolean(recruiter.is_verify_phone));

        if (recruiter.is_verify_phone) {
          setMessage("Số điện thoại của bạn đã được xác thực.");
          return;
        }

        await sendOtp(recruiter.phone);
      } catch (err) {
        setMessage("");
        setError(getErrorMessage(err, "Không thể lấy số điện thoại."));
      } finally {
        setPageLoading(false);
      }
    };

    init();
  }, [sendOtp]);

  const handleVerify = async () => {
    const normalizedOtp = otp.trim();

    if (!/^\d{6}$/.test(normalizedOtp)) {
      setMessage("");
      setError("Mã OTP phải gồm 6 chữ số.");
      return;
    }

    try {
      setVerifying(true);
      setError("");
      setMessage("");

      const response = await verifyPhoneOtp({
        phone,
        otp: normalizedOtp,
      });

      setIsVerified(true);
      setOtp("");

      setMessage(
        response?.message || "Xác thực số điện thoại thành công."
      );
    } catch (err) {
      setMessage("");
      setError(
        getErrorMessage(err, "Xác thực số điện thoại thất bại.")
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = () => {
    if (!phone || sending || isVerified) return;

    sendOtp(phone);
  };

  const handleClose = () => {
    navigate("/recruiter-profile");
  };

  if (pageLoading) {
    return (
      <div className={styles.content}>
        <h2 className={styles.title}>Xác thực số điện thoại</h2>
        <p className={styles.desc}>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h2 className={styles.title}>Xác thực số điện thoại</h2>

      <p className={styles.desc}>
        Mã OTP sẽ được tạo cho số điện thoại {phone || "của bạn"}.
      </p>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(event) => {
          setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
          setError("");
          setMessage("");
        }}
        placeholder="Nhập mã OTP"
        className={styles.input}
        disabled={isVerified || verifying || !phone}
      />

      {message && <p className={styles.success}>{message}</p>}

      {error && <p className={styles.error}>{error}</p>}

      {!phone && (
        <Link to="/recruiter-profile" className={styles.linkButton}>
          Cập nhật số điện thoại
        </Link>
      )}

      {phone && !isVerified && (
        <button
          type="button"
          className={styles.button}
          onClick={handleVerify}
          disabled={verifying || sending}
        >
          {verifying ? "Đang xác thực..." : "Xác thực số điện thoại"}
        </button>
      )}

      {phone && !isVerified && (
        <p className={styles.resend}>
          Không nhận được mã{" "}
          <button type="button" onClick={handleResend} disabled={sending}>
            {sending ? "Đang gửi..." : "Gửi lại"}
          </button>
        </p>
      )}

      <button
        type="button"
        className={styles.closeButton}
        onClick={handleClose}
      >
        Đóng
      </button>
    </div>
  );
}