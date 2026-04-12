import React from "react";
import "./Homepage.css"; 
import logo from "../../assets/images/logo.png";
import heroImage from "../../assets/images/image.png";
import JobCard from "../../components/JobCard/JobCard";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import JobItem from "./components/JobIntem/JobItem";
import MyCVFlow from "./components/MyCVFlow/MyCVFlow";

const steps = [
    { icon: <span className="material-symbols-outlined">person_add</span>, title: "Tạo tài khoản" },
    { icon: <span className="material-symbols-outlined">upload</span>, title: "Tải CV/Resume" },
    { icon: <span className="material-symbols-outlined">search</span>, title: "Tìm công việc phù hợp" },
    { icon: <span className="material-symbols-outlined">send</span>, title: "Đăng ký ứng tuyển" },
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
const jobCards = [
  {
    logo: logo,
    title: "Senior UX Designer",
    type: "Part Time",
    location: "Đà Nẵng",
    salary_min: 30000,
    salary_max: 35000,
    deadline: "Còn 4 ngày",
  },
  {
    logo: logo,
    title: "Software Engineer",
    type: "Full Time",
    location: "Thanh Khê",
    salary_min: 50000,
    salary_max: 60000,
    deadline: "Còn 4 ngày",
  },
];
function Homepage() {
  return (
    <>
    <Header />
    <div className="homepage">      
      <section className="homepage-hero">
        <div className="homepage-hero-container">
          <div className="homepage-hero-text-block">
            <h2 className="homepage-hero-title">Nơi bạn tìm thấy công việc lý tưởng</h2>
            <p className="homepage-hero-text">
              Cuộc sống đôi khi gặp phải những thử thách và trở ngại, nhưng chúng ta
              luôn có thể vượt qua nếu kiên trì và nỗ lực. Đừng ngần ngại tìm kiếm
              cơ hội và phát triển bản thân.
            </p>
          </div>       
          <img src={heroImage} alt="Hero" className="homepage-hero-image" />
        </div>
      </section>

      <section className="homepage-stats">
        <div className="homepage-stats-container">
          <div className="homepage-stat-box">
            <span className="material-symbols-outlined homepage-stat-icon">work</span>
            <div>
              <h3>1,75,324</h3>
              <p>Live Job</p>
            </div>
          </div>
          <div className="homepage-stat-box">
            <span className="material-symbols-outlined homepage-stat-icon">apartment</span>
            <div>
              <h3>97,354</h3>
              <p>Companies</p>
            </div>
          </div>
          <div className="homepage-stat-box">
            <span className="material-symbols-outlined homepage-stat-icon">group</span>
            <div>
              <h3>38,47,154</h3>
              <p>Candidates</p>
            </div>
          </div>
          <div className="homepage-stat-box">
            <span className="material-symbols-outlined homepage-stat-icon">work</span>
            <div>
              <h3>7,532</h3>
              <p>New Jobs</p>
            </div>
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

    <section className="homepage-job-cards">
        <div className="job-cards-header">
        <h3 className="job-cards-title">Công việc nổi bật</h3>
        <button className="job-cards-btn">
          Xem tất cả →
        </button>
      </div>
      
      {jobCards.map((job, index) => (
        <JobCard
          key={index}
          logo={job.logo}
          title={job.title}
          type={job.type}
          location={job.location}
          salary={job.salary_min + "VND–" + job.salary_max + "VND"}
          deadline={job.deadline}
        />
      ))}
    </section>
    
    <section>
      <div className="register-container">
        <div className="register-panel red">
          <h3 className="register-title">Trở thành ứng viên</h3>
          <p className="register-text">
            Chúng tôi mang đến quy trình tối ưu, giúp bạn tiếp cận cơ hội việc làm
            một cách hiệu quả và nhanh chóng.
          </p>
          <button className="register-btn">
            Đăng Ký Ngay <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="register-panel blue">
          <h3 className="register-title">Trở thành nhà tuyển dụng</h3>
          <p className="register-text">
            Chúng tôi giúp doanh nghiệp tiếp cận nguồn ứng viên chất lượng, tối ưu
            quy trình tuyển dụng và nâng cao hiệu quả tìm kiếm nhân tài.
          </p>
          <button className="register-btn">
            Đăng Ký Ngay <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
    </div>
    <Footer />
    </>
  );
}

export default Homepage;
