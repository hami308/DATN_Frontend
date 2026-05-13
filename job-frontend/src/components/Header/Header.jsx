import React from "react";
import "./Header.css";

import logo from "../../assets/images/logo.png";

import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  // =========================
  // GET USER FROM LOCALSTORAGE
  // =========================
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="homepage-header">
      <div className="homepage-left">
        <img src={logo} alt="MyCV Logo" className="homepage-logo" />

        <h1 className="homepage-title">MyCV</h1>
      </div>

      {/* IF NOT LOGIN */}
      {!user?.email && (
        <button
          className="homepage-join-btn"
          onClick={() => navigate("/login")}
        >
          Tham gia ngay
        </button>
      )}
    </header>
  );
}

export default Header;