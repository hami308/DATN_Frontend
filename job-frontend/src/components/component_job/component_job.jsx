import React from 'react';
import "./component_job.css";

const ComponentJob = ({title, logo, company_name, location, salary}) => {
  const handleSaveJob = () => alert('❤️ Đã lưu tin thành công!');
  const handleApplyNow = () => alert('✨ Ứng tuyển ngay!');

  return (
    <div className="component-job-card">
      {/* Phần Header: Logo + Tiêu đề */}
      <div className="component-job-header">
        <div className="component-job-card-logo">
          <img className="component-job-card-logo" src={logo} alt="Logo" />
        </div>
        <div className="component-job-header-info">
          <h2 className="component-job-title">{title}</h2>
          <p className="component-job-company">{company_name}</p>
        </div>
      </div>

      {/* Địa điểm */}
      <div className="component-job-location">
        <span className="material-symbols-outlined">location_on</span>
        <span className="component-job-location-text">{location}</span>
      </div>

      {/* Mức lương (Full width) */}
      <div className="component-job-salary">
        {salary}
      </div>

      {/* Nút bấm */}
      <div className="component-job-actions">
        <button className="component-job-btn-save" onClick={handleSaveJob}>
          <span className="component-job-heart-icon">♡</span> Lưu tin
        </button>
        <button className="component-job-btn-apply" onClick={handleApplyNow}>
          Ứng tuyển ngay
        </button>
      </div>
    </div>
  );
};

export default ComponentJob;