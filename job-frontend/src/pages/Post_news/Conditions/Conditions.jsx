import React, { useState } from "react";
import Header from "../../../components/Header/Header";
import MenuCard from "../../../components/MenuCard/MenuCard";
import Footer from "../../../components/Footer/Footer";
import "./Conditions.css";

const steps = [
  { title: "Xác thực số điện thoại", done: true },
  { title: "Cập nhật thông tin công ty", done: false },
  { title: "Cập nhật giấy đăng ký doanh nghiệp", done: false },
  { title: "Đăng tin tuyển dụng đầu tiên", done: false },
];

export default function Conditions() {
  const [collapsed, setCollapsed] = useState(false);

  const completedCount = steps.filter((item) => item.done).length;
  const percent = (completedCount / steps.length) * 100;

  return (
    <>
      <Header />

      {/* Sidebar + Content cùng 1 div */}
      <div className="setup-layout">
        <MenuCard collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className={`setup-wrapper ${collapsed ? "collapsed" : ""}`}>
          <div className="setup-card">
            <h2 className="setup-title">Xin chào Nguyễn Hà My</h2>

            <p className="setup-subtitle">
              Hãy thực hiện các bước sau để có thể có được trải nghiệm tốt nhất
              tại MyCV
            </p>

            <div className="setup-list">
              {steps.map((step, index) => {
                let isLocked = false;

                if (index === 2) {
                  isLocked = !steps[1].done;
                } else if (index === 3) {
                  isLocked = !steps.slice(0, 3).every((s) => s.done);
                }

                return (
                  <div
                    key={index}
                    className={`setup-item ${isLocked ? "locked" : ""}`}
                  >
                    <div className="setup-left">
                      <span
                        className={`setup-check ${
                          step.done ? "done" : "pending"
                        }`}
                      >
                        {step.done ? "✔" : ""}
                      </span>

                      <span className="setup-text">{step.title}</span>
                    </div>

                    <button
                      className="setup-arrow"
                      disabled={isLocked}
                      title={
                        isLocked
                          ? "Vui lòng hoàn thành các bước trước"
                          : ""
                      }
                    >
                      ➜
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="setup-progress-section">
              <span className="setup-percent">
                Hoàn thành {percent}%
              </span>

              <div className="setup-progress-bar">
                <div
                  className="setup-progress-fill"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}