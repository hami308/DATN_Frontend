import React, { useEffect, useMemo, useState } from "react";
import JobComponent from "../../components/Job_component/Job_component";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Manage_Recuitment.css";
import MenuCard from "../../components/MenuCard/MenuCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";
import { getAllIndustries } from "../../service/industry/industry";
import {
  closeMyCompanyJobApi,
  extendMyCompanyJobApi,
  getMyCompanyJobsApi,
  reopenMyCompanyJobApi,
} from "../../service/job/my_company_jobs";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  return (
    error?.message ||
    error?.data?.message ||
    error?.error ||
    "Không thể tải danh sách tin tuyển dụng."
  );
};

const formatDeadline = (expire) => {
  if (!expire) return "Chưa có hạn";

  const expireDate = new Date(expire);

  if (Number.isNaN(expireDate.getTime())) return "Chưa có hạn";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expireDate.setHours(0, 0, 0, 0);

  const dayDiff = Math.ceil(
    (expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff < 0) return "Đã hết hạn";
  if (dayDiff === 0) return "Hết hạn hôm nay";

  return `Còn ${dayDiff} ngày`;
};

const formatExpireDate = (expire) => {
  if (!expire) return "";

  const expireDate = new Date(expire);

  if (Number.isNaN(expireDate.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN").format(expireDate);
};

const formatStatus = (status) => {
  const normalizedStatus = Number(status);

  if (normalizedStatus === 1) return "Đang mở";
  if (normalizedStatus === 2) return "Đã hết hạn";
  if (normalizedStatus === 0) return "Đã đóng";

  return "Chờ xử lý";
};

const mapJobToCard = (job) => ({
  id: job.id,
  logo: job.logo || job.company_logo || null,
  title: job.name || "Tin tuyển dụng",
  type: job.job_type_name || job.jobTypeName || "Chưa cập nhật",
  level: job.level_name || job.levelName || "Chưa cập nhật",
  location: job.location || "Chưa cập nhật",
  salary_min: job.salary_min,
  salary_max: job.salary_max,
  deadline: formatDeadline(job.expire),
  expire: job.expire,
  expireText: [formatExpireDate(job.expire), formatDeadline(job.expire)]
    .filter(Boolean)
    .join(" - "),
  candidateNumber: job.candidate_number || job.candidateNumber,
  statusCode: job.status,
  status: formatStatus(job.status),
});

const normalizeIndustries = (response) => {
  const industries =
    response?.industries ||
    response?.data?.industries ||
    response?.data ||
    response;

  return Array.isArray(industries) ? industries : [];
};

function ManageRecuitment() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [industryLoading, setIndustryLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 5;

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyCompanyJobsApi(filters);
        const responseJobs = response?.data?.jobs || [];

        if (isMounted) {
          setJobs(responseJobs.map(mapJobToCard));
          setCurrentPage(1);
        }
      } catch (error) {
        if (isMounted) {
          setError(getErrorMessage(error));
          setJobs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  useEffect(() => {
    let isMounted = true;

    const fetchIndustries = async () => {
      try {
        setIndustryLoading(true);

        const response = await getAllIndustries();

        if (isMounted) {
          setIndustries(normalizeIndustries(response));
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục nghề:", error);

        if (isMounted) {
          setIndustries([]);
        }
      } finally {
        if (isMounted) {
          setIndustryLoading(false);
        }
      }
    };

    fetchIndustries();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.ceil(jobs.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const currentJobs = useMemo(
    () => jobs.slice(startIndex, startIndex + limit),
    [jobs, startIndex],
  );

  const handleCloseJob = async (job) => {
    try {
      const response = await closeMyCompanyJobApi(job.id);
      const closedJob = response?.data?.job;

      setJobs((prevJobs) => {
        if (filters.status && String(filters.status) !== "0") {
          return prevJobs.filter((item) => item.id !== job.id);
        }

        return prevJobs.map((item) =>
          item.id === job.id
            ? {
                ...item,
                statusCode: closedJob?.status ?? 0,
                status: formatStatus(closedJob?.status ?? 0),
              }
            : item,
        );
      });
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  const handleReopenJob = async (job) => {
    try {
      const response = await reopenMyCompanyJobApi(job.id);
      const reopenedJob = response?.data?.job;

      setJobs((prevJobs) => {
        if (filters.status && String(filters.status) !== "1") {
          return prevJobs.filter((item) => item.id !== job.id);
        }

        return prevJobs.map((item) =>
          item.id === job.id
            ? {
                ...item,
                statusCode: reopenedJob?.status ?? 1,
                status: formatStatus(reopenedJob?.status ?? 1),
              }
            : item,
        );
      });
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  const handleExtendJob = async (date, job) => {
    try {
      const response = await extendMyCompanyJobApi(job.id, date.toISOString());
      const extendedJob = response?.data?.job;
      const nextStatus = extendedJob?.status ?? job.statusCode;
      const nextExpire = extendedJob?.expire ?? date.toISOString();

      setJobs((prevJobs) =>
        prevJobs.map((item) =>
          item.id === job.id
            ? {
                ...item,
                expire: nextExpire,
                deadline: formatDeadline(nextExpire),
                expireText: [
                  formatExpireDate(nextExpire),
                  formatDeadline(nextExpire),
                ]
                  .filter(Boolean)
                  .join(" - "),
                statusCode: nextStatus,
                status: formatStatus(nextStatus),
              }
            : item,
        ),
      );
    } catch (error) {
      alert(getErrorMessage(error));
    }
  };

  return (
    <>
      <Header />
      <div className="manage-recuitment-container">
        <MenuCard />
        <div className="manage-recuitment-content">
          <div className="manage-recuitment-header">
            <h2 className="manage-job-title">Danh sách các tin tuyển dụng</h2>
            <SearchBar
              industries={industries}
              industryLoading={industryLoading}
              onSearch={setFilters}
            />
          </div>

          <div className="manage-job-list">
            {loading ? (
              <div className="manage-job-state">Đang tải danh sách tin...</div>
            ) : error ? (
              <div className="manage-job-state error">{error}</div>
            ) : currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <JobComponent
                  key={job.id}
                  id={job.id}
                  logo={job.logo}
                  title={job.title}
                  type={job.type}
                  level={job.level}
                  location={job.location}
                  salaryMin={job.salary_min}
                  salaryMax={job.salary_max}
                  deadline={job.deadline}
                  expire={job.expire}
                  expireText={job.expireText}
                  candidateNumber={job.candidateNumber}
                  statusCode={job.statusCode}
                  status={job.status}
                  onCloseJob={handleCloseJob}
                  onExtendJob={handleExtendJob}
                  onReopenJob={handleReopenJob}
                />
              ))
            ) : (
              <div className="manage-job-state">
                Không có tin tuyển dụng phù hợp.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ManageRecuitment;
