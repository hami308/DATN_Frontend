import React from "react";
import "./Header.css";

import logo from "../../assets/images/logo.png";

import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";
  const displayName =
    user?.full_name ||
    user?.fullName ||
    user?.name ||
    (isAdmin ? "Admin" : "Người dùng");
  const roleLabel =
    user?.role === "candidate"
      ? "Ứng viên"
      : user?.role === "recruiter"
        ? "Nhà tuyển dụng"
        : "";

  const handleUserClick = () => {
    if (user.role === "candidate") {
      navigate("/candidate-profile");
    } else if (user.role === "recruiter") {
      navigate("/recruiter-profile");
    } else if (user.role === "admin") {
      navigate("/home-admin");
    }
  };

  return (
    <header className="homepage-header">
      <div
        className="homepage-left"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="MyCV Logo" className="homepage-logo" />

        <h1 className="homepage-title">MyCV</h1>
      </div>

      {/* NOT LOGIN */}
      {!user?.email && (
        <button
          className="homepage-join-btn"
          onClick={() => navigate("/login")}
        >
          Tham gia ngay
        </button>
      )}

      {/* LOGGED IN */}
      {user?.email && (
        <div className="homepage-user" onClick={handleUserClick}>
          <div className="homepage-avatar">
            {isAdmin ? (
              <span className="material-symbols-outlined">person</span>
            ) : user?.avatar ? (
              <img src={user.avatar} alt="avatar" />
            ) : (
              <span>
                {(displayName || user?.email || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="homepage-user-info">
            <div className="homepage-user-name">{displayName}</div>

            <div className="homepage-user-role">{roleLabel}</div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
