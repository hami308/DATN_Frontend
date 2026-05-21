import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import CompanyDetail from "../../components/Company/CompanyDetail";
import JobCard from "../../components/JobCard/JobCard";
import Pagination from "../../components/Pagination/Pagination";
import { getMySavedJobsApi } from "../../service/candidate/savedJob.service";
import { getCompanyDetailById } from "../../service/comapny/company_infor";
import Sidebar_Admin from "../../components/Sidebar_admin/Sidebar";
import styles from "./Company_page.module.css";

const JOBS_PER_PAGE = 4;

const getCompanyFromResponse = (response) => {
  if (response?.data?.company) return response.data.company;
  if (response?.company) return response.company;
  if (response?.data && !Array.isArray(response.data)) return response.data;

  return null;
};

const getJobs = (company) => {
  const jobs =
    company?.jobs ||
    company?.open_jobs ||
    company?.company_jobs ||
    company?.job_list ||
    [];

  return Array.isArray(jobs) ? jobs : [];
};

export default function Company_page() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedJobIds, setSavedJobIds] = useState([]);

  useEffect(() => {
    let ignore = false;

    const fetchCompany = async () => {
      if (!companyId) {
        setError("Không tìm thấy mã công ty.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await getCompanyDetailById(companyId);
        const companyData = getCompanyFromResponse(response);

        if (!ignore) {
          setCompany(companyData);
          setCurrentPage(1);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err?.response?.data?.message ||
              "Không thể tải thông tin công ty. Vui lòng thử lại sau.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchCompany();

    return () => {
      ignore = true;
    };
  }, [companyId]);

  useEffect(() => {
    let ignore = false;

    const fetchSavedJobs = async () => {
      if (role !== "candidate") {
        setSavedJobIds([]);
        return;
      }

      try {
        const response = await getMySavedJobsApi();
        const savedJobs = response?.data?.data?.jobs || [];
        const ids = savedJobs.map((job) => Number(job.id));

        if (!ignore) {
          setSavedJobIds(ids);
        }
      } catch (error) {
        console.error("GET SAVED JOBS ERROR:", error);
      }
    };

    fetchSavedJobs();

    return () => {
      ignore = true;
    };
  }, [role]);

  const jobs = useMemo(() => getJobs(company), [company]);
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const currentJobs = jobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  const handleViewRecruiter = (recruiterId) => {
    navigate(`/recruiter-profile/${recruiterId}`);
  };

  const handleSavedChange = (jobId, nextSaved) => {
    setSavedJobIds((currentIds) => {
      const currentJobId = Number(jobId);

      if (nextSaved) {
        return currentIds.includes(currentJobId)
          ? currentIds
          : [...currentIds, currentJobId];
      }

      return currentIds.filter((id) => id !== currentJobId);
    });
  };

  const logo = company?.logo || company?.logo_url || company?.avatar;

  return (
    <div className={styles.companyPage}>
      <Header />

      <main className={styles.mainContent}>
        {role === "candidate" && <Sidebar />}
        {role === "admin" && <Sidebar_Admin />}

        <div className={styles.content}>
          <button
            className={styles.backBtn}
            type="button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            Quay lại
          </button>

          {loading ? (
            <div className={styles.pageState}>
              <Loader2 className={styles.spin} size={30} />
              Đang tải thông tin công ty...
            </div>
          ) : error ? (
            <div className={styles.pageState}>{error}</div>
          ) : (
            <>
              <CompanyDetail
                company={company}
                onViewRecruiter={handleViewRecruiter}
              />

              <section className={styles.jobSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2>Danh sách tuyển dụng đang mở</h2>
                  </div>
                  <strong>{jobs.length}</strong>
                </div>

                {currentJobs.length > 0 ? (
                  <>
                    <div className={styles.list}>
                      {currentJobs.map((job) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          logo={logo}
                          title={job.name || job.title || "Tin tuyển dụng"}
                          type={
                            job.job_type_name ||
                            job.job_type?.name ||
                            "Chưa cập nhật"
                          }
                          location={
                            job.location || company?.location || "Chưa cập nhật"
                          }
                          salaryMin={job.salary_min}
                          salaryMax={job.salary_max}
                          deadline={job.expire}
                          isSaved={savedJobIds.includes(Number(job.id))}
                          onSavedChange={handleSavedChange}
                        />
                      ))}
                    </div>

                    {totalPages > 1 ? (
                      <div className={styles.paginationWrap}>
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div className={styles.emptyJobs}>
                    <BriefcaseBusiness size={30} />
                    <div>
                      <h3>Chưa có tin tuyển dụng đang mở</h3>
                      <p>Công ty hiện chưa có job phù hợp để hiển thị.</p>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
