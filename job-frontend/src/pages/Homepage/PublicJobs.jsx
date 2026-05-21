import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import JobCard from "../../components/JobCard/JobCard";
import AcvancedFilter from "../../components/AdvancedFilter/AdvancedFilter";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";
import { ArrowLeft } from "lucide-react";
import styles from "./PublicJobs.module.css";
import logoDefault from "../../assets/images/logo.png";

import { getJobsApi } from "../../service/job/get_jobs";

export default function PublicJobs() {
  const [currentPage, setCurrentPage] = useState(1);

  const [jobs, setJobs] = useState([]);

  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({});

  const [filterParams, setFilterParams] = useState({});

  const jobsPerPage = 5;

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

        setJobs(response.data.jobs || []);

        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (error) {
        console.error("GET JOBS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, searchParams, filterParams]);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <button
          className={styles.backBtn}
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <div className={styles.top}>
          <SearchBar
            onSearch={(values) => {
              setCurrentPage(1);

              setSearchParams(values);
            }}
          />
        </div>

        <div className={styles.content}>
          <aside className={styles.filter}>
            <AcvancedFilter
              onFilterChange={(values) => {
                setCurrentPage(1);

                setFilterParams(values);
              }}
            />
          </aside>

          <section className={styles.list}>
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
                  salaryMin={job.salary_min}
                  salaryMax={job.salary_max}
                  deadline={job.expire}
                />
              ))}

            {!loading && jobs.length === 0 && <p>Không tìm thấy việc làm.</p>}

            {!loading && totalPages > 1 && (
              <div className={styles.paginationWrap}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
