import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Applied_jobs.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import JobComponent from "../../components/Job_component/Job_component";
import Combobox from "../../components/Combobox/Combobox";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
export default function Homepage() {
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const jobCards = [
    {
      logo: logo,
      title: "Senior UX Designer",
      type: "Part Time",
      location: "Đà Nẵng",
      salary_min: 30000,
      salary_max: 35000,
      deadline: "Còn 4 ngày",
      status: "Đã ứng tuyển",
      role: "Recuiter",
    },
    {
      logo: logo,
      title: "Frontend Developer",
      type: "Full Time",
      location: "Hà Nội",
      salary_min: 30000,
      salary_max: 35000,
      deadline: "Còn 7 ngày",
      status: "Đã ứng tuyển",
      role: "Candidate",
    },
    {
      logo: logo,
      title: "Backend Engineer",
      type: "Full Time",
      location: "TP. Hồ Chí Minh",
      salary_min: 30000,
      salary_max: 35000,
      deadline: "Còn 10 ngày",
      status: "Nhà tuyển dụng đã xem",
      role: "Recuiter",
    },
    {
      logo: logo,
      title: "Backend Engineer",
      type: "Full Time",
      location: "TP. Hồ Chí Minh",
      salary_min: 30000,
      salary_max: 35000,
      deadline: "Còn 10 ngày",
      status: "Nhà tuyển dụng đã xem",
      role: "Recuiter",
    },
    {
      logo: logo,
      title: "Backend Engineer",
      type: "Full Time",
      location: "TP. Hồ Chí Minh",
      salary_min: 30000,
      salary_max: 35000,
      deadline: "Còn 10 ngày",
      status: "Nhà tuyển dụng đã xem",
      role: "Recuiter",
    },
    {
      logo: logo,
      title: "Backend Engineer",
      type: "Full Time",
      location: "TP. Hồ Chí Minh",
      salary_min: 30000,
      salary_max: 35000,
      deadline: "Còn 10 ngày",
      status: "Nhà tuyển dụng đã xem",
      role: "Recuiter",
    },
  ];

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = jobCards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(jobCards.length / jobsPerPage);

  const [filter, setFilter] = useState("");

  return (
    <div className={styles.homepage}>
      <Header />

      <div className={styles.main}>
        <Sidebar />

        <div className={styles.right}>
          <div className={styles.body}>
            <div className={styles.pageHeader}>
              <h2 className={styles.title}>Danh sách việc làm đã ứng tuyển</h2>
            </div>
            <div className={styles.actions}>
              <Combobox
                defaultValue="Tất cả trạng thái"
                options={["Tất cả trạng thái", "Đã ứng tuyển", "NTD đã xem"]}
                onSelect={(value) => setFilter(value)}
              />
            </div>
            <div className={styles.list}>
              {currentJobs.map((job, index) => (
                <JobComponent
                  key={index}
                  logo={job.logo}
                  title={job.title}
                  type={job.type}
                  location={job.location}
                  salary={job.salary_min + "VND–" + job.salary_max + "VND"}
                  deadline={job.deadline}
                  status={job.status}
                />
              ))}
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
      </div>

      <Footer />
    </div>
  );
}
