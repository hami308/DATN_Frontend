import React, { useEffect, useState } from "react";
import "./JobCard.css";

import { useNavigate } from "react-router-dom";

import logoDefault from "../../assets/images/logo.png";
import { BASE_URL } from "../../service/api";
import {
  saveMyJobApi,
  unsaveMyJobApi,
} from "../../service/candidate/savedJob.service";
import { formatJobLocation } from "../../utils/jobLocation";
import { formatSalary } from "../../utils/salary";

const fileBaseUrl = BASE_URL.replace("/api", "");

const getLogoUrl = (logo) => {
  if (!logo) return logoDefault;

  const logoPath = String(logo).trim();

  if (!logoPath) return logoDefault;
  if (
    logoPath.startsWith("http") ||
    logoPath.startsWith("data:") ||
    logoPath.startsWith("blob:")
  ) {
    return logoPath;
  }

  if (logoPath.startsWith("/uploads")) {
    return `${fileBaseUrl}${logoPath}`;
  }

  if (logoPath.startsWith("uploads")) {
    return `${fileBaseUrl}/${logoPath}`;
  }

  return logoPath;
};

function JobCard({
  id,
  logo,
  title,
  location,
  salary,
  salaryMin,
  salaryMax,
  deadline,
  isSaved = false,
  onSavedChange,
}) {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const logoSrc = getLogoUrl(logo);
  const locationDisplay = formatJobLocation(location);

  const handleLogoError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied) return;

    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = logoDefault;
  };

  const handleToggleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Bạn cần đăng nhập để lưu việc làm.");
        return;
      }

      if (user.role !== "candidate") {
        alert("Chỉ ứng viên mới có thể lưu việc làm.");
        return;
      }

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
      alert(
        error?.message ||
          error?.data?.message ||
          "Thao tác lưu việc làm thất bại.",
      );
    } finally {
      setSaving(false);
    }
  };
  const getDeadlineText = (deadline) => {
    if (!deadline) return "Chưa cập nhật";

    const today = new Date();
    const expireDate = new Date(deadline);

    if (Number.isNaN(expireDate.getTime())) return deadline;

    today.setHours(0, 0, 0, 0);
    expireDate.setHours(0, 0, 0, 0);

    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Đã hết hạn";
    if (diffDays === 0) return "Hết hạn hôm nay";

    return `Còn ${diffDays} ngày`;
  };
  return (
    <div className="job-card">
      <div className="job-card-left">
        <img
          src={logoSrc}
          alt="Company Logo"
          className="job-card-logo"
          onError={handleLogoError}
        />

        <div className="job-card-info">
          <div className="job-card-top">
            <h3
              className="job-card-title clickable-title"
              onClick={() => navigate(`/job-details/${id}`)}
              title={title}
            >
              {title}
            </h3>

          </div>

          <div className="job-card-meta">
            <div className="job-card-info-item">
              <span className="material-symbols-outlined">location_on</span>
              <span
                className="job-card-location-text"
                title={locationDisplay.tooltipText}
              >
                {locationDisplay.displayText}
              </span>
            </div>

            <div className="job-card-info-item">
              <span className="material-symbols-outlined">payments</span>
              <span>{salary || formatSalary(salaryMin, salaryMax)}</span>
            </div>

            <div className="job-card-info-item">
              <span className="material-symbols-outlined">schedule</span>
              <span>{getDeadlineText(deadline)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="job-card-right">
        <span
          className={`material-symbols-outlined bookmark ${
            saved ? "saved" : ""
          } ${saving ? "saving" : ""}`}
          onClick={!saving ? handleToggleSave : undefined}
          title={saved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
        >
          bookmark
        </span>

        <button
          className="apply-btn"
          onClick={() => navigate(`/job-details/${id}`)}
        >
          Ứng tuyển ngay
        </button>
      </div>
    </div>
  );
}

export default JobCard;
