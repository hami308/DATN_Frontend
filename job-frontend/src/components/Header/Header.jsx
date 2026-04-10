import React from "react";
import "./Header.css";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
  return (
    <header className="homepage-header">
      <div>
        <img src={logo} alt="MyCV Logo" className="homepage-logo" />
        <h1 className="homepage-title">MyCV</h1>
      </div>
      <button className="homepage-join-btn" onClick={() => navigate("/login")}>
        Tham gia ngay
      </button>
    </header>
  );
}
export default Header;
