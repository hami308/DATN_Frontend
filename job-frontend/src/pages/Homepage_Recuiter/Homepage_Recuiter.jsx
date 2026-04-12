import React ,{ useState }  from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Homepage_Recuiter.css";
import heroImage from "../../assets/images/image.png";
import MenuCard from "../../components/MenuCard/MenuCard";
import MyCVFlow from "../Homepage/components/MyCVFlow/MyCVFlow";
import JobItem from "../Homepage/components/JobIntem/JobItem";
import ActionButton from "./components/ActionButton";

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
    { title: "Xác thực số điện thoại" , href:"/verify-phone"},
    { title: "Cập nhật thông tin công ty" , href:"/update-company-info"},
    { title: "Cập nhật giấy đăng ký doanh nghiệp" , href:"/update-business-license"},
    { title: "Đăng tin tuyển dụng" , href:"/post-job"},
];
function HomepageRecuiter() {
  const [collapsed, setCollapsed] = useState(false);
    return (
      <div className={`layout ${collapsed ? "collapsed" : ""}`}>
       
      <MenuCard
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
        <div className="homepage-recuiter">
           
            <Header />
            <section className="homepage-hero">
              <div className="homepage-hero-container">
                <div className="homepage-hero-text-block">
                    <h2 className="homepage-hero-title">Nơi bạn tìm thấy ứng viên lý tưởng, phù hợp với nhu cầu và văn hóa doanh nghiệp.</h2>
                    <p className="homepage-hero-text">
                    Đừng ngần ngại mở rộng tìm kiếm và phát triển đội ngũ – ứng viên phù hợp luôn đang chờ bạn khám phá.
                    </p>
                </div>
                <img src={heroImage} alt="Hero" className="homepage-hero-image" />
              </div>
            </section>
            <section className="onboarding-section">
              <div className="onboarding-container">
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
                    <ActionButton label={condition.title} href={condition.href} />
                    </div>
                ))}
                </div>
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
      </div>);
}
export default HomepageRecuiter;