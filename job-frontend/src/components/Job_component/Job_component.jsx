import React, { useState, useRef, useEffect } from "react";
import "./Job_component.css";
import logo_img from "../../assets/images/logo.png";
import Close_Job from "../Popup/Close_Job/Close_Job";
import Extend_Job from "../Popup/Extend_Job/Extend_Job";

function JobComponent({
  logo,
  title,
  type,
  location,
  salary,
  deadline,
  status,
}) {
  const role = "recuiter";
  const [showMenu, setShowMenu] = useState(false);
  const [showClosePopup, setShowClosePopup] = useState(false);
  const [showExtendPopup, setShowExtendPopup] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="job-component">
      {/* LEFT */}
      <div className="job-component-left">
        <img
          src={logo || logo_img}
          alt="Company Logo"
          className="job-component-logo"
        />
        <div className="job-component-info">
          <div className="job-component-top">
            <h3 className="job-component-title">{title}</h3>
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
              <span className="material-symbols-outlined">attach_money</span>
              <span>{salary}</span>
            </div>
            <div className="job-component-info-item">
              <span className="material-symbols-outlined">schedule</span>
              <span>{deadline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="job-component-right">
        <button className="job-component-status-btn">{status}</button>

        {role === "recuiter" ? (
          <div className="job-component-menu-wrapper" ref={menuRef}>
            <span
              className="material-symbols-outlined job-component-menu"
              onClick={() => setShowMenu(!showMenu)}
            >
              menu
            </span>

            {showMenu && (
              <div className="job-component-dropdown">
                <div onClick={() => setShowMenu(false)}>Xem chi tiết tin</div>

                <div
                  onClick={() => {
                    setShowClosePopup(true);
                    setShowMenu(false);
                  }}
                >
                  Đóng tin
                </div>

                <div onClick={() => setShowMenu(false)}>Xem danh sách ứng viên</div>

                <div
                  onClick={() => {
                    setShowExtendPopup(true);
                    setShowMenu(false);
                  }}
                >
                  Gia hạn tin
                </div>

                <div onClick={() => setShowMenu(false)}>Chỉnh sửa tin</div>
              </div>
            )}
          </div>
        ) : (
          <span className="material-symbols-outlined job-component-bookmark">
            bookmark
          </span>
        )}
      </div>

      {/* POPUP ĐÓNG TIN */}
      {showClosePopup && (
        <Close_Job onCancel={() => setShowClosePopup(false)} onConfirm={() => {
          // xử lý đóng tin
          setShowClosePopup(false);
        }} />
      )}

      {/* POPUP GIA HẠN TIN */}
      {showExtendPopup && (
        <Extend_Job onCancel={() => setShowExtendPopup(false)} onConfirm={(date) => {
          console.log("Gia hạn đến:", date);
          setShowExtendPopup(false);
        }} />
      )}
    </div>
  );
}

export default JobComponent;
