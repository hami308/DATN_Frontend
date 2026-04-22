import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import CompanyDetail from "../../components/Company/CompanyDetail";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./Company_page.module.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Company_page() {
  const role = "candidate";
  const navigate = useNavigate();
  const jobs = [
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/FPT_logo_2010.svg",
      title: "Frontend React Developer",
      type: "Full Time",
      location: "Đà Nẵng",
      salary: "20tr - 30tr",
      deadline: "Còn 5 ngày",
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/FPT_logo_2010.svg",
      title: "Backend NodeJS",
      type: "Full Time",
      location: "Hà Nội",
      salary: "25tr - 35tr",
      deadline: "Còn 3 ngày",
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/FPT_logo_2010.svg",
      title: "Fullstack Developer",
      type: "Full Time",
      location: "HCM",
      salary: "30tr - 40tr",
      deadline: "Còn 7 ngày",
    },
  ];

  /* pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 2;

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <div className={styles.companyPage}>
      <Header />

      <div className={styles.mainContent}>
        {role === "candidate" && <Sidebar />}

        <div className={styles.content}>
          <div className={styles.backBtn} onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Quay lại</span>
          </div>
          <CompanyDetail />

          {/* job section */}
          <div className={styles.jobSection}>
            <div className={styles.sectionHeader}>
              <span>Danh sách tuyển dụng của công ty</span>
            </div>

            <div className={styles.list}>
              {currentJobs.map((job, index) => (
                <JobCard
                  key={index}
                  logo={job.logo}
                  title={job.title}
                  type={job.type}
                  location={job.location}
                  salary={job.salary}
                  deadline={job.deadline}
                />
              ))}
            </div>

            <div className={styles.paginationWrap}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
