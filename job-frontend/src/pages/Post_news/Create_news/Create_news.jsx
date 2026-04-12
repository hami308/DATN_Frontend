import React, { useState } from "react";
import "./Create_news.css";
import Header from "../../../components/Header/Header";
import MenuCard from "../../../components/MenuCard/MenuCard";
import Footer from "../../../components/Footer/Footer";

export default function CreateJob() {
  const [collapsed, setCollapsed] = useState(false);
  const [step, setStep] = useState(1); // State để quản lý bước hiện tại

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <>
      <Header />
      <MenuCard collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`createjob-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <div className="createjob-card">
          <h2 className="createjob-main-title">Tạo tin tuyển dụng mới</h2>

          {/* Steps */}
          <div className="createjob-steps-container">
            <div className={`createjob-step-item ${step === 1 ? 'active' : 'completed'}`}>
              <span className="createjob-step-number">Ⅰ</span>
              <span className="createjob-step-text">Thông tin tuyển dụng</span>
            </div>

            <div className={`createjob-step-divider ${step === 2 ? 'active' : ''}`}></div>

            <div className={`createjob-step-item ${step === 2 ? 'active' : ''}`}>
              <span className="createjob-step-number">Ⅱ</span>
              <span className="createjob-step-text">Quyền lợi, thời gian & Đăng bài</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="createjob-form-content">
            {step === 1 ? (
              /* --- STEP 1 UI --- */
              <>
                <h3 className="createjob-section-title">1. Thông tin công việc</h3>
                <div className="createjob-form-grid">
                  <div className="createjob-form-group">
                    <label className="createjob-label">Vị trí tuyển dụng *</label>
                    <input className="createjob-input" type="text" placeholder="Vị trí tuyển dụng" />
                  </div>
                  <div className="createjob-form-group">
                    <label className="createjob-label">Cấp độ *</label>
                    <select className="createjob-select">
                      <option>Intern</option>
                      <option>Junior</option>
                      <option>Senior</option>
                    </select>
                  </div>
                  <div className="createjob-form-group">
                    <label className="createjob-label">Số lượng cần tuyển *</label>
                    <input className="createjob-input" type="number" placeholder="Số lượng cần tuyển" />
                  </div>
                  <div className="createjob-form-group">
                    <label className="createjob-label">Kinh nghiệm *</label>
                    <input className="createjob-input" type="text" placeholder="Kinh nghiệm" />
                  </div>
                  <div className="createjob-form-group createjob-salary-container">
                    <label className="createjob-label">Mức lương (VNĐ)</label>
                    <div className="createjob-salary-flex">
                      <input className="createjob-input" type="text" placeholder="Từ" />
                      <span className="createjob-salary-separator">-</span>
                      <input className="createjob-input" type="text" placeholder="Đến" />
                    </div>
                  </div>
                </div>

                <h3 className="createjob-section-title">2. Mô tả công việc và yêu cầu ứng viên</h3>
                <div className="createjob-form-grid-two-col">
                  <div className="createjob-form-group">
                    <label className="createjob-label">Mô tả công việc *</label>
                    <textarea className="createjob-textarea" placeholder="Mô tả công việc"></textarea>
                  </div>
                  <div className="createjob-form-group">
                    <label className="createjob-label">Yêu cầu ứng viên *</label>
                    <textarea className="createjob-textarea" placeholder="Yêu cầu ứng viên"></textarea>
                  </div>
                </div>

                <h3 className="createjob-section-title">3. Địa điểm</h3>
                <div className="createjob-form-group">
                  <input className="createjob-input" type="text" placeholder="Địa điểm" />
                </div>

                <div className="createjob-action-footer">
                  <button className="createjob-btn-next" onClick={nextStep}>Tiếp tục</button>
                </div>
              </>
            ) : (
              /* --- STEP 2 UI (Giao diện theo ảnh bạn gửi) --- */
              <>
                <div className="createjob-step2-container">
                  <div className="createjob-form-group">
                    <h3 className="createjob-section-title-step2">1. Quyền lợi ứng viên</h3>
                    <textarea 
                      className="createjob-textarea-large" 
                      placeholder="Quyền lợi ứng viên"
                    ></textarea>
                    <p className="createjob-note">Lưu ý : Mô tả quyền lợi càng chi tiết càng thu hút ứng viên</p>
                  </div>

                  <div className="createjob-form-group">
                    <h3 className="createjob-section-title-step2">2. Hình thức làm việc</h3>
                    <input className="createjob-input" type="text" placeholder="Hình thức làm việc" />
                  </div>

                  <div className="createjob-form-group">
                    <h3 className="createjob-section-title-step2">3. Thời gian</h3>
                    <label className="createjob-label-sub">Hạn chót nộp hồ sơ</label>
                    <input className="createjob-input" type="text" placeholder="Hạn chót nộp hồ sơ" />
                  </div>
                </div>

                <div className="createjob-action-footer step2-footer">
                  <button className="createjob-btn-back" onClick={prevStep}>Quay lại</button>
                  <button className="createjob-btn-submit">Đăng bài</button>
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