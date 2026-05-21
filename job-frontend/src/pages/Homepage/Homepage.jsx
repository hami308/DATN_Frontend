import React from "react";
import "./Homepage.css";
import logo from "../../assets/images/logo.png";
import heroImage from "../../assets/images/image.png";
import JobCard from "../../components/JobCard/JobCard";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import JobItem from "./components/JobIntem/JobItem";
import MyCVFlow from "./components/MyCVFlow/MyCVFlow";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobsApi } from "../../service/job/get_jobs";
import { getHomepageStatsApi } from "../../service/homepage/homepage";
const steps = [
  {
    icon: <span className="material-symbols-outlined">person_add</span>,
    title: "Tạo tài khoản",
  },
  {
    icon: <span className="material-symbols-outlined">upload</span>,
    title: "Tải CV/Resume",
  },
  {
    icon: <span className="material-symbols-outlined">search</span>,
    title: "Tìm công việc phù hợp",
  },
  {
    icon: <span className="material-symbols-outlined">send</span>,
    title: "Đăng ký ứng tuyển",
  },
];
const defaultHomepageStats = {
  totalJobs: 0,
  totalCompanies: 0,
  totalRecruiters: 0,
  totalCandidates: 0,
  topIndustries: [],
};

const formatNumber = (value) => {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return "0";

  return new Intl.NumberFormat("vi-VN").format(numberValue);
};

function Homepage() {
  const navigate = useNavigate();
  const [jobCards, setJobCards] = useState([]);
  const [homepageStats, setHomepageStats] = useState(defaultHomepageStats);
  const [loadingJobs, setLoadingJobs] = useState(false);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);

        const response = await getJobsApi({
          page: 1,
          limit: 5,
        });

        setJobCards(response?.data?.jobs || []);
      } catch (error) {
        console.error("GET HOMEPAGE JOBS ERROR:", error);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchHomepageStats = async () => {
      try {
        const response = await getHomepageStatsApi();
        const stats = response?.data || {};

        setHomepageStats({
          ...defaultHomepageStats,
          ...stats,
          topIndustries: Array.isArray(stats.topIndustries)
            ? stats.topIndustries
            : [],
        });
      } catch (error) {
        console.error("GET HOMEPAGE STATS ERROR:", error);
      }
    };

    fetchHomepageStats();
  }, []);

  const topIndustries = homepageStats.topIndustries.map((industry) => ({
    id: industry.id,
    title: industry.name,
    count: formatNumber(industry.jobs),
  }));

  return (
    <>
      <Header />
      <div className="homepage">
        <section className="homepage-hero">
          <div className="homepage-hero-container">
            <div className="homepage-hero-text-block">
              <h2 className="homepage-hero-title">
                Nơi bạn tìm thấy công việc lý tưởng
              </h2>
              <p className="homepage-hero-text">
                Cuộc sống đôi khi gặp phải những thử thách và trở ngại, nhưng
                chúng ta luôn có thể vượt qua nếu kiên trì và nỗ lực. Đừng ngần
                ngại tìm kiếm cơ hội và phát triển bản thân.
              </p>
            </div>
            <img src={heroImage} alt="Hero" className="homepage-hero-image" />
          </div>
        </section>

        <section className="homepage-stats">
          <div className="homepage-stats-container">
            <div className="homepage-stat-box">
              <span className="material-symbols-outlined homepage-stat-icon">
                work
              </span>
              <div>
                <h3>{formatNumber(homepageStats.totalJobs)}</h3>
                <p>Tin tuyển dụng</p>
              </div>
            </div>
            <div className="homepage-stat-box">
              <span className="material-symbols-outlined homepage-stat-icon">
                apartment
              </span>
              <div>
                <h3>{formatNumber(homepageStats.totalCompanies)}</h3>
                <p>Công ty</p>
              </div>
            </div>
            <div className="homepage-stat-box">
              <span className="material-symbols-outlined homepage-stat-icon">
                group
              </span>
              <div>
                <h3>{formatNumber(homepageStats.totalCandidates)}</h3>
                <p>Ứng viên</p>
              </div>
            </div>
            <div className="homepage-stat-box">
              <span className="material-symbols-outlined homepage-stat-icon">
                work
              </span>
              <div>
                <h3>{formatNumber(homepageStats.totalRecruiters)}</h3>
                <p>Nhà tuyển dụng</p>
              </div>
            </div>
          </div>
        </section>

        <section className="homepage-jobs">
          <h3 className="homepage-jobs-title">
            Các vị trí tuyển dụng phổ biến
          </h3>
          <div className="homepage-job-list">
            {topIndustries.map((job, index) => (
              <JobItem key={job.id || index} title={job.title} count={job.count} />
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
            <h3 className="job-cards-title">Danh sách công việc</h3>
            <button
              className="job-cards-btn"
              onClick={() => navigate("/public-jobs")}
            >
              Xem tất cả →
            </button>
          </div>

          {loadingJobs && <p>Đang tải việc làm...</p>}

          {!loadingJobs &&
            jobCards.map((job) => (
              <JobCard
                key={job.id}
                id={job.id}
                logo={job.company?.logo || logo}
                title={job.name}
                type={job.job_type?.name || "Chưa cập nhật"}
                location={job.location || "Chưa cập nhật"}
                salaryMin={job.salary_min}
                salaryMax={job.salary_max}
                deadline={job.expire}
              />
            ))}
        </section>

        <section>
          <div className="register-container">
            <div className="register-panel red">
              <h3 className="register-title">Trở thành ứng viên</h3>
              <p className="register-text">
                Chúng tôi mang đến quy trình tối ưu, giúp bạn tiếp cận cơ hội
                việc làm một cách hiệu quả và nhanh chóng.
              </p>
              <button
                className="register-btn"
                onClick={() => navigate("/register/candidate")}
              >
                Đăng Ký Ngay{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="register-panel blue">
              <h3 className="register-title">Trở thành nhà tuyển dụng</h3>
              <p className="register-text">
                Chúng tôi giúp doanh nghiệp tiếp cận nguồn ứng viên chất lượng,
                tối ưu quy trình tuyển dụng và nâng cao hiệu quả tìm kiếm nhân
                tài.
              </p>
              <button
                className="register-btn"
                onClick={() => navigate("/register/recruiter")}
              >
                Đăng Ký Ngay{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
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
