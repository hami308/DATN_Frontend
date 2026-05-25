import React from "react";
import "./component_job.css";

const ComponentJob = ({ title, logo, company_name, location, salary, onClick }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const handleSaveJob = (event) => {
    event.stopPropagation();
    alert("Đã lưu tin thành công!");
  };

  const handleApplyNow = (event) => {
    event.stopPropagation();
    alert("Ứng tuyển ngay!");
  };

  const handleKeyDown = (event) => {
    if (!onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`component-job-card ${onClick ? "clickable" : ""}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="component-job-header">
        <div className="component-job-card-logo">
          <img className="component-job-card-logo" src={logo} alt="Logo" />
        </div>
        <div className="component-job-header-info">
          <h2 className="component-job-title">{title}</h2>
          <p className="component-job-company">{company_name}</p>
        </div>
      </div>

      <div className="component-job-location">
        <span className="material-symbols-outlined">location_on</span>
        <span className="component-job-location-text">{location}</span>
      </div>

      <div className="component-job-salary">{salary}</div>
    {
        role === "candidate" && (
          <div className="component-job-actions">
            <button className="component-job-btn-save" onClick={handleSaveJob}>
              <span className="component-job-heart-icon">♡</span> Lưu tin
            </button>
            <button className="component-job-btn-apply" onClick={handleApplyNow}>
              Ứng tuyển ngay
            </button>
          </div>
      )
    }
      
    </div>
  );
};

export default ComponentJob;
