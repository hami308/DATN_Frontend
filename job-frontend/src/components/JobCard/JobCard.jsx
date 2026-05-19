import React, { useEffect, useState } from "react";
import "./JobCard.css";

import { useNavigate } from "react-router-dom";

import {
  saveMyJobApi,
  unsaveMyJobApi,
} from "../../service/candidate/savedJob.service";

function JobCard({
  id,
  logo,
  title,
  type,
  location,
  salary,
  deadline,
  isSaved = false,
}) {
  const navigate = useNavigate();

  const [saved, setSaved] = useState(isSaved);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

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
      } else {
        await saveMyJobApi(id);
        setSaved(true);
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

  return (
    <div className="job-card">
      <div className="job-card-left">
        <img src={logo} alt="Company Logo" className="job-card-logo" />

        <div className="job-card-info">
          <div className="job-card-top">
            <h3
              className="job-card-title clickable-title"
              onClick={() => navigate(`/job-details/${id}`)}
            >
              {title}
            </h3>

            <span
              className={`job-card-type ${
                type === "Full Time" ? "full" : "part"
              }`}
            >
              {type}
            </span>
          </div>

          <div className="job-card-meta">
            <div className="job-card-info-item">
              <span className="material-symbols-outlined">location_on</span>
              <span>{location}</span>
            </div>

            <div className="job-card-info-item">
              <span className="material-symbols-outlined">payments</span>
              <span>{salary}</span>
            </div>

            <div className="job-card-info-item">
              <span className="material-symbols-outlined">schedule</span>
              <span>{deadline}</span>
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
