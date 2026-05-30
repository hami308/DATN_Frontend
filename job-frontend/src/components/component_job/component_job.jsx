import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApplyJobModal from "../ApplyJobModal/ApplyJobModal";
import {
  saveMyJobApi,
  unsaveMyJobApi,
} from "../../service/candidate/savedJob.service";
import "./component_job.css";
import logoDefault from "../../assets/images/logo.png";

const getErrorMessage = (error, fallback) => {
  return error?.message || error?.data?.message || error?.error || fallback;
};

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const ComponentJob = ({
  id,
  title,
  logo,
  company,
  companyName,
  company_name,
  location,
  salary,
  isSaved = false,
  onClick,
  onSavedChange,
}) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const role = user?.role;

  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const displayCompanyName =
    company_name ||
    companyName ||
    company?.name ||
    company?.company_name ||
    company?.companyName ||
    "Chưa cập nhật";
  const displayLogo =
    logo || company?.logo || company?.logo_url || company?.avatar || logoDefault;

  const handleLogoError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied) return;

    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = logoDefault;
  };

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const handleSaveJob = async (event) => {
    event.stopPropagation();

    if (!id) {
      alert("Không tìm thấy mã việc làm.");
      return;
    }

    if (!user?.id) {
      alert("Bạn cần đăng nhập để lưu việc làm.");
      navigate("/login");
      return;
    }

    if (role !== "candidate") {
      alert("Chỉ ứng viên mới có thể lưu việc làm.");
      return;
    }

    try {
      setSaving(true);

      if (saved) {
        await unsaveMyJobApi(id);
        setSaved(false);
        onSavedChange?.(id, false);
      } else {
        await saveMyJobApi(id);
        setSaved(true);
        onSavedChange?.(id, true);
      }
    } catch (error) {
      alert(getErrorMessage(error, "Thao tác lưu việc làm thất bại."));
    } finally {
      setSaving(false);
    }
  };

  const handleApplyNow = (event) => {
    event.stopPropagation();

    if (!id) {
      alert("Không tìm thấy mã việc làm.");
      return;
    }

    if (!user?.id) {
      alert("Bạn cần đăng nhập để ứng tuyển.");
      navigate("/login");
      return;
    }

    if (role !== "candidate") {
      alert("Chỉ ứng viên mới có thể ứng tuyển.");
      return;
    }

    setShowApplyModal(true);
  };

  const handleKeyDown = (event) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <>
      <div
        className={`component-job-card ${onClick ? "clickable" : ""}`}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        <div className="component-job-header">
          <div className="component-job-card-logo">
            <img
              className="component-job-card-logo"
              src={displayLogo}
              alt="Logo"
              onError={handleLogoError}
            />
          </div>

          <div className="component-job-header-info">
            <h2 className="component-job-title">{title}</h2>
            <p className="component-job-company">{displayCompanyName}</p>
          </div>
        </div>

        <div className="component-job-location">
          <span className="material-symbols-outlined">location_on</span>
          <span className="component-job-location-text">{location}</span>
        </div>

        <div className="component-job-salary">{salary}</div>

        {role === "candidate" && (
          <div className="component-job-actions">
            <button
              className={`component-job-btn-save ${saved ? "saved" : ""}`}
              onClick={handleSaveJob}
              disabled={saving}
              type="button"
            >
              <span className="material-symbols-outlined component-job-heart-icon">
                {saved ? "bookmark_added" : "bookmark"}
              </span>
              {saved ? "Đã lưu" : "Lưu tin"}
            </button>

            <button
              className="component-job-btn-apply"
              onClick={handleApplyNow}
              type="button"
            >
              Ứng tuyển ngay
            </button>
          </div>
        )}
      </div>

      {showApplyModal && (
        <ApplyJobModal jobId={id} onClose={() => setShowApplyModal(false)} />
      )}
    </>
  );
};

export default ComponentJob;
