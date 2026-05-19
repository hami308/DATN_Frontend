import React from "react";
import "./Header.css";

import logo from "../../assets/images/logo.png";

import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
        <div
          className="homepage-user"
          onClick={() => {
            if (user.role === "candidate") {
              navigate("/candidate-profile");
            } else {
              navigate("/recruiter-profile");
            }
          }}
        >
          <div className="homepage-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" />
            ) : (
              <span>
                {(user?.full_name || user?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="homepage-user-info">
            <div className="homepage-user-name">
              {user?.full_name || "Người dùng"}
            </div>

            <div className="homepage-user-role">
              {user?.role === "candidate" ? "Ứng viên" : "Nhà tuyển dụng"}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
