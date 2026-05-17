import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import MenuCard from "../../../components/MenuCard/MenuCard";
import Footer from "../../../components/Footer/Footer";
import { getRecruiterConditions } from "../../../service/recruiter/check_condition";
import "./Conditions.css";

export default function Conditions() {
  const [collapsed, setCollapsed] = useState(false);
  const [steps, setSteps] = useState([]);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConditions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecruiterConditions();

      setFullName(response.data?.fullName || "Nhà tuyển dụng");

      setSteps([
        {
          title: "Xác thực số điện thoại",
          done: Boolean(response.data?.isVerifyPhone),
        },
        {
          title: "Cập nhật thông tin công ty",
          done: Boolean(response.data?.hasCompanyInfo),
        },
        {
          title: "Cập nhật giấy đăng ký doanh nghiệp",
          done: Boolean(response.data?.hasCertificate),
        },
        {
          title: "Đăng tin tuyển dụng đầu tiên",
          done: Boolean(response.data?.hasFirstJob),
        },
      ]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể tải điều kiện tài khoản."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConditions();
  }, []);

  const completedCount = steps.filter((item) => item.done).length;
  const percent =
    steps.length > 0
      ? Math.round((completedCount / steps.length) * 100)
      : 0;

  return (
    <>
      <Header />

      <div className="setup-layout">
        <MenuCard collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className={`setup-wrapper ${collapsed ? "collapsed" : ""}`}>
          <div className="setup-card">
            <h2 className="setup-title">
              Xin chào {fullName}
            </h2>

            <p className="setup-subtitle">
              Hãy thực hiện các bước sau để có thể có được trải nghiệm tốt nhất
              tại MyCV
            </p>

            {loading && (
              <p className="setup-loading">Đang tải dữ liệu...</p>
            )}

            {error && (
              <p className="setup-error">{error}</p>
            )}

            {!loading && !error && (
              <>
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
                        className={`setup-item ${
                          isLocked ? "locked" : ""
                        }`}
                      >
                        <div className="setup-left">
                          <span
                            className={`setup-check ${
                              step.done ? "done" : "pending"
                            }`}
                          >
                            {step.done ? "✔" : ""}
                          </span>

                          <span className="setup-text">
                            {step.title}
                          </span>
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
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}