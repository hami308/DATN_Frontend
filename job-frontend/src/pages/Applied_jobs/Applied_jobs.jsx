import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Applied_jobs.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import JobComponent from "../../components/Job_component/Job_component";
import Combobox from "../../components/Combobox/Combobox";
import Pagination from "../../components/Pagination/Pagination";

import logoDefault from "../../assets/images/logo.png";

import { getMyApplicationsApi } from "../../service/candidate/application_service";

const APPLICATION_STATUS_LABEL = {
  pending: "Đang chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Đã từ chối",
};

const getStatusText = (status) => {
  return APPLICATION_STATUS_LABEL[status] || "Đang chờ duyệt";
};

export default function AppliedJobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Tất cả trạng thái");

  const jobsPerPage = 5;
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await getMyApplicationsApi();

      setApplications(response?.data?.data?.applications || []);
    } catch (error) {
      alert(
        error?.message ||
          error?.data?.message ||
          "Lấy danh sách việc làm đã ứng tuyển thất bại.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((application) => {
    if (filter === "Tất cả trạng thái") return true;

    return getStatusText(application.status) === filter;
  });

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;

  const currentApplications = filteredApplications.slice(
    indexOfFirst,
    indexOfLast,
  );

  const totalPages = Math.ceil(filteredApplications.length / jobsPerPage);

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
                options={[
                  "Tất cả trạng thái",
                  "Đang chờ duyệt",
                  "Đã duyệt",
                  "Đã từ chối",
                ]}
                onSelect={(value) => {
                  setCurrentPage(1);
                  setFilter(value);
                }}
              />
            </div>

            <div className={styles.list}>
              {loading && <p>Đang tải việc làm đã ứng tuyển...</p>}

              {!loading &&
                currentApplications.map((application) => {
                  const job = application.job || {};
                  const company = job.company || {};

                  return (
                    <JobComponent
                      key={application.id}
                      id={job.id}
                      logo={company.logo || logoDefault}
                      title={job.name || "Tin tuyển dụng"}
                      type={job.job_type?.name || "Chưa cập nhật"}
                      location={
                        job.location || company.location || "Chưa cập nhật"
                      }
                      salaryMin={job.salary_min}
                      salaryMax={job.salary_max}
                      deadline={job.expire}
                      status={getStatusText(application.status)}
                      statusCode={application.status}
                    />
                  );
                })}

              {!loading && filteredApplications.length === 0 && (
                <p>Không có việc làm phù hợp.</p>
              )}

              {!loading && filteredApplications.length > 0 && (
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
