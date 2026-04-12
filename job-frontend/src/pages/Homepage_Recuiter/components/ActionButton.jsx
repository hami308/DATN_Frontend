import React from "react";
import "./ActionButton.css";
function ActionButton({ label , href}) {
  return (
    <a href={href} className="home-recuiter-action-button">
      <div className="home-recuiter-radio-icon"></div>
      <span className="home-recuiter-label">{label}</span>
      <div className="home-recuiter-arrow-icon">
        <span className="material-symbols-outlined">arrow_outward</span>
      </div>
    </a>
  );
}
export default ActionButton;