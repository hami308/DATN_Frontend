import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import JobCard from "../../components/JobCard/JobCard";
import CatFace from "../../components/CatFace/CatFace";
import AcvancedFilter from "../../components/AdvancedFilter/AdvancedFilter";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";

import styles from "./Homepage.module.css";
import logoDefault from "../../assets/images/logo.png";

import { getJobsApi } from "../../service/job/get_jobs";

import { getMySavedJobsApi } from "../../service/candidate/savedJob.service";

export default function Homepage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({});
  const [filterParams, setFilterParams] = useState({});

  const jobsPerPage = 5;

  const fetchSavedJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || user.role !== "candidate") {
        setSavedJobIds([]);
        return;
      }

      const response = await getMySavedJobsApi();

      const savedJobs = response?.data?.data?.jobs || [];

      const ids = savedJobs.map((job) => Number(job.id));

      setSavedJobIds(ids);
    } catch (error) {
      console.error("GET SAVED JOBS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await getJobsApi({
          page: currentPage,
          limit: jobsPerPage,
          ...searchParams,
          ...filterParams,
        });

        setJobs(response.data.jobs);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, searchParams, filterParams]);

  return (
    <div className={styles.homepage}>
      <Header />

      <div className={styles.main}>
        <Sidebar />

        <div className={styles.right}>
          <div className={styles.top}>
            <CatFace />

            <SearchBar
              onSearch={(values) => {
                setCurrentPage(1);
                setSearchParams(values);
              }}
            />
          </div>

          <div className={styles.body}>
            <div className={styles.filter}>
              <AcvancedFilter
                onFilterChange={(values) => {
                  setCurrentPage(1);
                  setFilterParams(values);
                }}
              />
            </div>

            <div className={styles.list}>
              {loading && <p>Đang tải việc làm...</p>}

              {!loading &&
                jobs.map((job) => (
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
                    isSaved={savedJobIds.includes(Number(job.id))}
                  />
                ))}

              {!loading && jobs.length === 0 && <p>Không tìm thấy việc làm.</p>}

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
