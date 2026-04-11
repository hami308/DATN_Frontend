import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Homepage_Recuiter.css";
import heroImage from "../../assets/images/image.png";
import MenuCard from "../../components/MenuCard/MenuCard";

function ActionButton({ label }) {
  return (
    <div className="home-recuiter-action-button">
      <div className="home-recuiter-radio-icon"></div>
      <span className="home-recuiter-label">{label}</span>
      <div className="home-recuiter-arrow-icon">
        <span className="material-symbols-outlined">arrow_outward</span>
      </div>
    </div>
  );
}

function JobItem({ title, count }) {
  return (
    <div className="homepage-job-item">
      <h4 className="job-title">{title}</h4>
      <p className="job-count">{count} vị trí</p>
    </div>
  );
}
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

const steps = [
    { icon: <span className="material-symbols-outlined">person_add</span>, title: "Tạo tài khoản" },
    { icon: <span className="material-symbols-outlined">upload</span>, title: "Cung cấp các thông tin cần thiết" },
    { icon: <span className="material-symbols-outlined">search</span>, title: "Đăng tải tin tuyển dụng" },
    { icon: <span className="material-symbols-outlined">send</span>, title: "Nhận và quản lý hồ sơ ứng viên" },
  ];
const jobs = [
  { title: "Bác sĩ gây mê", count: "45,904" },
  { title: "Nhân viên văn phòng", count: "50,364" },
  { title: "Giáo viên tiểu học", count: "4,339" },
  { title: "Nhân viên IT", count: "74,875" },
  { title: "Kỹ sư xây dựng", count: "18,599" },
  { title: "Marketing", count: "61,391" },
  { title: "Saler", count: "93,046" },
  { title: "IT Manager", count: "50,963" },
  { title: "Kỹ sư dữ liệu", count: "16,627" },
];
const conditions = [
    { title: "Xác thực số điện thoại" },
    { title: "Cập nhật thông tin công ty" },
    { title: "Cập nhật giấy đăng ký doanh nghiệp" },
    { title: "Đăng tin tuyển dụng" },
];
function HomepageRecuiter() {
    return (
        <div className="homepage-recuiter">
            <MenuCard />
            <Header />
            <section className="homepage-hero">
                <div className="homepage-hero-text-block">
                    <h2 className="homepage-hero-title">Nơi bạn tìm thấy ứng viên lý tưởng, phù hợp với nhu cầu và văn hóa doanh nghiệp.</h2>
                    <p className="homepage-hero-text">
                    Đừng ngần ngại mở rộng tìm kiếm và phát triển đội ngũ – ứng viên phù hợp luôn đang chờ bạn khám phá.
                    </p>
                </div>
                <img src={heroImage} alt="Hero" className="homepage-hero-image" />
            </section>
            <section className="onboarding-section">
                <div className="onboarding-content">
                <div className="progress-circle-container">
                    <div className="progress-circle">
                    <span className="progress-text">0%</span>
                    </div>
                </div>
                
                <div className="greeting-text">
                    <h2>Xin chào, Nguyễn Văn A</h2>
                    <p>Làm theo hướng dẫn để bắt đầu tuyển dụng hiệu quả</p>
                </div>
                </div>

                <div className="home-recuiter-container">
                {conditions.map((condition, index) => (
                    <div key={index} className="home-recuiter-step">
                    <ActionButton label={condition.title} />
                    </div>
                ))}
                </div>
            </section>
            <section className="homepage-jobs">
                <h3 className="homepage-jobs-title">Các vị trí tuyển dụng phổ biến</h3>
                <div className="homepage-job-list">
                    {jobs.map((job, index) => (
                    <JobItem key={index} title={job.title} count={job.count} />
                    ))}
                </div>
            </section>
            <section>
                <div className="mycvflow-container">
                    <h2 className="mycvflow-title">MyCV hoạt động như thế nào?</h2>
                    <div className="mycvflow-steps">
                    {steps.map((step, index) => (
                        <MyCVFlow
                        key={index}
                        index={index}
                        icon={step.icon}
                        title={step.title}
                        isLast={index === steps.length - 1}
                        />
                    ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
export default HomepageRecuiter;