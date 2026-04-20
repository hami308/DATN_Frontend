import React, { useState } from "react";
import "./Create_news.css";
import Header from "../../../components/Header/Header";
import MenuCard from "../../../components/MenuCard/MenuCard";
import Footer from "../../../components/Footer/Footer";

export default function CreateJob() {
  const [collapsed, setCollapsed] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <>
      <Header />

      <div className="createjob-layout">
        <MenuCard collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="createjob-wrapper">
          <div className="createjob-card">
            <h2 className="createjob-main-title">
              Tạo tin tuyển dụng mới
            </h2>

            {/* Steps */}
            <div className="createjob-steps-container">
              <div
                className={`createjob-step-item ${
                  step === 1 ? "active" : "completed"
                }`}
              >
                <span className="createjob-step-number">Ⅰ</span>
                <span>Thông tin tuyển dụng</span>
              </div>

              <div
                className={`createjob-step-divider ${
                  step === 2 ? "active" : ""
                }`}
              ></div>

              <div
                className={`createjob-step-item ${
                  step === 2 ? "active" : ""
                }`}
              >
                <span className="createjob-step-number">Ⅱ</span>
                <span>Quyền lợi, thời gian & Đăng bài</span>
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 ? (
              <>
                <h3 className="createjob-section-title">
                  1. Thông tin công việc
                </h3>

                <div className="createjob-form-grid">
                  <div className="createjob-form-group">
                    <label>Vị trí tuyển dụng *</label>
                    <input
                      type="text"
                      className="createjob-input"
                      placeholder="Vị trí tuyển dụng"
                    />
                  </div>

                  <div className="createjob-form-group">
                    <label>Cấp độ *</label>
                    <select className="createjob-input">
                      <option>Intern</option>
                      <option>Junior</option>
                      <option>Senior</option>
                    </select>
                  </div>

                  <div className="createjob-form-group">
                    <label>Số lượng *</label>
                    <input
                      type="number"
                      className="createjob-input"
                    />
                  </div>

                  <div className="createjob-form-group">
                    <label>Kinh nghiệm *</label>
                    <input
                      type="text"
                      className="createjob-input"
                    />
                  </div>

                  <div className="createjob-form-group salary-box">
                    <label>Mức lương</label>

                    <div className="salary-flex">
                      <input
                        type="text"
                        className="createjob-input"
                        placeholder="Từ"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        className="createjob-input"
                        placeholder="Đến"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="createjob-section-title">
                  2. Mô tả công việc
                </h3>

                <div className="createjob-form-grid-two">
                  <textarea
                    className="createjob-textarea"
                    placeholder="Mô tả công việc"
                  ></textarea>

                  <textarea
                    className="createjob-textarea"
                    placeholder="Yêu cầu ứng viên"
                  ></textarea>
                </div>

                <h3 className="createjob-section-title">
                  3. Địa điểm
                </h3>

                <input
                  type="text"
                  className="createjob-input"
                  placeholder="Địa điểm"
                />

                <div className="footer-btn">
                  <button
                    className="btn-primary"
                    onClick={() => setStep(2)}
                  >
                    Tiếp tục
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="createjob-section-title">
                  1. Quyền lợi ứng viên
                </h3>

                <textarea
                  className="createjob-textarea-large"
                  placeholder="Quyền lợi ứng viên"
                ></textarea>

                <h3 className="createjob-section-title">
                  2. Hình thức làm việc
                </h3>

                <input
                  type="text"
                  className="createjob-input"
                  placeholder="Fulltime / Remote..."
                />

                <h3 className="createjob-section-title">
                  3. Hạn nộp hồ sơ
                </h3>

                <input
                  type="date"
                  className="createjob-input"
                />

                <div className="footer-btn">
                  <button
                    className="btn-outline"
                    onClick={() => setStep(1)}
                  >
                    Quay lại
                  </button>

                  <button className="btn-primary">
                    Đăng bài
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}