import React from "react";
import "./Header.css";
import logo from "../../assets/images/logo.png";
function Header() {
    return (
    <header className="homepage-header">
            <div>
                <img src={logo} alt="MyCV Logo" className="homepage-logo" />
                <h1 className="homepage-title">MyCV</h1>
            </div>
            <button className="homepage-join-btn">Tham gia ngay</button>
        </header>
        );
}
export default Header;