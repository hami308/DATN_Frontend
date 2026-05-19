import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Saved_job.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";

import logoDefault from "../../assets/images/logo.png";

import { getMySavedJobsApi } from "../../service/candidate/savedJob.service";

export default function SavedJobPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const jobsPerPage = 5;

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);

      const response = await getMySavedJobsApi();
      const jobs = response?.data?.data?.jobs || [];

      setSavedJobs(jobs);
    } catch (error) {
      alert(
        error?.message ||
          error?.data?.message ||
          "Lấy danh sách việc làm đã lưu thất bại.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = savedJobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);

  return (
    <div className={styles.homepage}>
      <Header />

      <div className={styles.main}>
        <Sidebar />

        <div className={styles.right}>
          <div className={styles.body}>
            <div className={styles.pageHeader}>
              <h2>Danh sách việc làm đã lưu</h2>
            </div>

            <div className={styles.list}>
              {loading && <p>Đang tải việc làm đã lưu...</p>}

              {!loading &&
                currentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    logo={job.company?.logo || logoDefault}
                    title={job.name}
                    type={job.job_type?.name || "Chưa cập nhật"}
                    location={job.location || "Chưa cập nhật"}
                    salary={`${job.salary_min || 0} VND - ${
                      job.salary_max || 0
                    } VND`}
                    deadline={
                      job.expire
                        ? new Date(job.expire).toLocaleDateString("vi-VN")
                        : "Chưa cập nhật"
                    }
                    isSaved={true}
                  />
                ))}

              {!loading && savedJobs.length === 0 && (
                <p>Bạn chưa lưu việc làm nào.</p>
              )}

              {!loading && savedJobs.length > 0 && (
                <div className={styles.paginationWrap}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
