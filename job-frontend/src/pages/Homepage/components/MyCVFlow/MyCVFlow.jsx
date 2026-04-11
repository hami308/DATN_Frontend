import React from 'react';
import './MyCVFlow.css';
function MyCVFlow({ index, icon, title, isLast }) {
  return (
    <React.Fragment key={index}>
      <div className="mycvflow-step">
        <div className="mycvflow-icon">{icon}</div>
        <p className="mycvflow-text">{title}</p>
      </div>
      {!isLast && <div className="mycvflow-arrow">➝</div>}
    </React.Fragment>
  );
}
export default MyCVFlow;