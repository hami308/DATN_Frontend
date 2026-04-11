import React from "react";

function JobItem({ title, count }) {
  return (
    <div className="homepage-job-item">
      <h4 className="job-title">{title}</h4>
      <p className="job-count">{count} vị trí</p>
    </div>
  );
}
export default JobItem;