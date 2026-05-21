import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Job_component.css";

import { useNavigate } from "react-router-dom";

import logo_img from "../../assets/images/logo.png";

import Close_Job from "../Popup/Close_Job/Close_Job";
import Extend_Job from "../Popup/Extend_Job/Extend_Job";

const getStatusClass = (statusCode) => {
  const normalizedStatus = Number(statusCode);

  if (normalizedStatus === 1) return "open";
  if (normalizedStatus === 0) return "closed";
  if (normalizedStatus === 2) return "expired";

  return "pending";
};

function JobComponent({
  id,
  logo,
  title,
  type,
  location,
  salary,
  deadline,
  status,
  statusCode,
  level,
  candidateNumber,
  expire,
  expireText,
  onCloseJob,
  onExtendJob,
  onReopenJob,
}) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const [showMenu, setShowMenu] = useState(false);
  const [showClosePopup, setShowClosePopup] = useState(false);
  const [showExtendPopup, setShowExtendPopup] = useState(false);

  const menuRef = useRef(null);
  const isClosed = Number(statusCode) === 0;

  const jobInfo = useMemo(
    () => ({
      id,
      logo,
      title,
      type,
      location,
      salary,
      deadline,
      status,
      statusCode,
      level,
      candidateNumber,
      expire,
      expireText: expireText || deadline,
    }),
    [
      id,
      logo,
      title,
      type,
      location,
      salary,
      deadline,
      status,
      statusCode,
      level,
      candidateNumber,
      expire,
      expireText,
    ],
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
    <div className="job-component">
      <div className="job-component-left">
        <img
          src={logo || logo_img}
          alt="Company Logo"
          className="job-component-logo"
        />

        <div className="job-component-info">
          <div className="job-component-top">
            <h3
              className="job-component-title clickable-title"
              onClick={() => navigate(`/job-details/${id}`)}
            >
              {title}
            </h3>

            <span
              className={`job-component-type ${
                type === "Full Time" ? "full" : "part"
              }`}
            >
              {type}
            </span>
          </div>

          <div className="job-component-meta">
            <div className="job-component-info-item">
              <span className="material-symbols-outlined">location_on</span>
              <span>{location}</span>
            </div>

            <div className="job-component-info-item">
              <span className="material-symbols-outlined">payments</span>
              <span>{salary}</span>
            </div>

            <div className="job-component-info-item">
              <span className="material-symbols-outlined">schedule</span>
              <span>{getDeadlineText(deadline)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="job-component-right">
        {role === "recruiter" && (
          <button
            className={`job-component-status-btn ${getStatusClass(statusCode)}`}
          >
            {status}
          </button>
        )}
        {role === "candidate" && (
          <button className={`job-component-status-btn ${statusCode} `}>
            {status}
          </button>
        )}

        {role === "recruiter" && (
          <div className="job-component-menu-wrapper" ref={menuRef}>
            <span
              className="material-symbols-outlined job-component-menu"
              onClick={() => setShowMenu(!showMenu)}
            >
              menu
            </span>

            {showMenu && (
              <div className="job-component-dropdown">
                <div
                  onClick={() => {
                    navigate(`/job-details/${id}`);
                    setShowMenu(false);
                  }}
                >
                  Xem chi tiết tin
                </div>

                {!isClosed && (
                  <div
                    onClick={() => {
                      setShowClosePopup(true);
                      setShowMenu(false);
                    }}
                  >
                    Đóng tin
                  </div>
                )}

                <div
                  onClick={() => {
                    navigate(`/job-applicants/${id}`);
                    setShowMenu(false);
                  }}
                >
                  Xem danh sách ứng viên
                </div>

                {isClosed ? (
                  <div
                    onClick={() => {
                      onReopenJob?.(jobInfo);
                      setShowMenu(false);
                    }}
                  >
                    Mở lại tin tuyển dụng
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setShowExtendPopup(true);
                      setShowMenu(false);
                    }}
                  >
                    Gia hạn tin
                  </div>
                )}

                <div
                  onClick={() => {
                    navigate(`/post-news/create-job/${id}`);
                    setShowMenu(false);
                  }}
                >
                  Chỉnh sửa tin
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showClosePopup && (
        <Close_Job
          job={jobInfo}
          onCancel={() => setShowClosePopup(false)}
          onConfirm={(job) => {
            onCloseJob?.(job);
            setShowClosePopup(false);
          }}
        />
      )}

      {showExtendPopup && (
        <Extend_Job
          job={jobInfo}
          onCancel={() => setShowExtendPopup(false)}
          onConfirm={(date, job) => {
            onExtendJob?.(date, job);
            setShowExtendPopup(false);
          }}
        />
      )}
    </div>
  );
}

export default JobComponent;
