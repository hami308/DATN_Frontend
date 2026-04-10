import React from "react";
import "./JobCard.css";

function JobCard({ logo, title, type, location, salary, deadline }) {
  return (
    <div className="job-card">
      {/* LEFT */}
      <div className="job-card-left">
        <img src={logo} alt="Company Logo" className="job-card-logo" />

        <div className="job-card-info">
          <div className="job-card-top">
            <h3 className="job-card-title">{title}</h3>
            <span className={`job-card-type ${type === "Full Time" ? "full" : "part"}`}>
              {type}
            </span>
          </div>

          <div className="job-card-meta">
            <div className="job-card-info-item">
              <span className="material-symbols-outlined">location_on</span>
              <span>{location}</span>
            </div>
            <div className="job-card-info-item">
              <span className="material-symbols-outlined">attach_money</span>
              <span>{salary}</span>
            </div>
            <div className="job-card-info-item">
              <span className="material-symbols-outlined">schedule</span>
              <span>{deadline}</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="job-card-right">
        <span className="material-symbols-outlined bookmark">bookmark</span>
        <button className="apply-btn">Ứng Tuyển Ngay</button>
      </div>
    </div>
  );
}

export default JobCard;
