import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MenuCard from "../../components/MenuCard/MenuCard";
import Sidebar from "../../components/Sidebar/Sidebar";
import ComponentJob from "../../components/component_job/component_job";
import ApplyJobModal from "../../components/ApplyJobModal/ApplyJobModal";
import { BASE_URL } from "../../service/api";
import {
  getCompanyJobsApi,
  getJobDetailApi,
} from "../../service/job/job_detail";
import {
  getMySavedJobsApi,
  saveMyJobApi,
  unsaveMyJobApi,
} from "../../service/candidate/savedJob.service";
import "./Job_Details.css";

import logoDefault from "../../assets/images/logo.png";

const fileBaseUrl = BASE_URL.replace("/api", "");

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string") return error;

  return error?.message || error?.data?.message || error?.error || fallback;
};

const getJobFromResponse = (response) => {
  return response?.data?.job || response?.job || response?.data || response;
};

const getJobsFromResponse = (response) => {
  const jobs =
    response?.data?.jobs ||
    response?.jobs ||
    response?.data?.data?.jobs ||
    response?.data ||
    response;

  return Array.isArray(jobs) ? jobs : [];
};

const getSavedJobsFromResponse = (response) => {
  const jobs =
    response?.data?.data?.jobs ||
    response?.data?.jobs ||
    response?.jobs ||
    response?.data ||
    response;

  return Array.isArray(jobs) ? jobs : [];
};

const getCompanyId = (job) => {
  return (
    job?.company_id ||
    job?.companyId ||
    job?.company?.company_id ||
    job?.company?.id ||
    job?.recruiter?.company_id ||
    job?.recruiter?.company?.id
  );
};

const getLogoUrl = (logo) => {
  if (!logo) return logoDefault;

  const logoPath = String(logo).trim();

  if (!logoPath) return logoDefault;
  if (
    logoPath.startsWith("http") ||
    logoPath.startsWith("data:") ||
    logoPath.startsWith("blob:")
  ) {
    return logoPath;
  }

  if (logoPath.startsWith("/uploads")) return `${fileBaseUrl}${logoPath}`;
  if (logoPath.startsWith("uploads")) return `${fileBaseUrl}/${logoPath}`;

  return logoPath;
};

const formatMoneyValue = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "";

  const millionValue = numberValue >= 1000000 ? numberValue / 1000000 : numberValue;

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 1,
  }).format(millionValue);
};

const formatSalary = (min, max) => {
  const minSalary = formatMoneyValue(min);
  const maxSalary = formatMoneyValue(max);

  if (minSalary && maxSalary) return `${minSalary} - ${maxSalary} triệu VND`;
  if (minSalary) return `Từ ${minSalary} triệu VND`;
  if (maxSalary) return `Đến ${maxSalary} triệu VND`;

  return "Thỏa thuận";
};

const formatExperience = (min, max) => {
  const hasMin = min !== null && min !== undefined && min !== "";
  const hasMax = max !== null && max !== undefined && max !== "";

  if (hasMin && hasMax) return `${min} - ${max} năm`;
  if (hasMin) return `Từ ${min} năm`;
  if (hasMax) return `Đến ${max} năm`;

  return "Chưa cập nhật";
};

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN").format(date);
};

const getName = (value, fallback = "Chưa cập nhật") => {
  return value?.name || value?.title || value || fallback;
};

const renderText = (value) => {
  if (!value) return <p>Chưa cập nhật</p>;

  return String(value)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => <p key={`${line}-${index}`}>{line}</p>);
};

const getCompanyName = (job, fallback = "Chưa cập nhật") =>
  job?.company?.name ||
  job?.company?.company_name ||
  job?.company?.companyName ||
  job?.companyName ||
  job?.company_name ||
  job?.name_company ||
  job?.recruiter?.company?.name ||
  job?.recruiter?.company?.company_name ||
  job?.recruiter?.company_name ||
  fallback;

const mapJobCard = (job, fallbackCompanyName, fallbackCompanyLogo) => ({
  id: job.id,
  title: job.name || job.title || "Tin tuyển dụng",
  logo: getLogoUrl(
    job.company?.logo || job.logo || job.company_logo || fallbackCompanyLogo
  ),
  company_name: getCompanyName(job, fallbackCompanyName),
  location: job.location || job.company?.location || "Chưa cập nhật",
  salary: formatSalary(job.salary_min, job.salary_max),
  isSaved: Boolean(job.is_saved || job.isSaved),
});

function Job_Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const [job, setJob] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState("");
  const [relatedError, setRelatedError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const jobDetailsCardRef = useRef(null);
  const [relatedPanelHeight, setRelatedPanelHeight] = useState(null);

  const roleSidebar =
    role === "candidate" ? (
      <Sidebar />
    ) : role === "recruiter" ? (
      <MenuCard />
    ) : null;

  useEffect(() => {
    let ignore = false;

    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJobDetailApi(id);
        const jobData = getJobFromResponse(response);

        if (!ignore) {
          setJob(jobData || null);
          setSaved(Boolean(jobData?.is_saved || jobData?.isSaved));
        }
      } catch (error) {
        if (!ignore) {
          setError(
            getErrorMessage(error, "Không thể tải thông tin việc làm.")
          );
          setJob(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchJobDetail();

    return () => {
      ignore = true;
    };
  }, [id]);

  const companyId = useMemo(() => getCompanyId(job), [job]);

  useEffect(() => {
    let ignore = false;

    const fetchCompanyJobs = async () => {
      if (!companyId) {
        setCompanyJobs([]);
        return;
      }

      try {
        setRelatedLoading(true);
        setRelatedError("");

        const response = await getCompanyJobsApi(companyId);
        const jobs = getJobsFromResponse(response);

        if (!ignore) {
          setCompanyJobs(jobs);
        }
      } catch (error) {
        if (!ignore) {
          setRelatedError(
            getErrorMessage(error, "Không thể tải việc làm cùng công ty.")
          );
          setCompanyJobs([]);
        }
      } finally {
        if (!ignore) {
          setRelatedLoading(false);
        }
      }
    };

    fetchCompanyJobs();

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
        const savedJobs = getSavedJobsFromResponse(response);
        const ids = savedJobs
          .map((job) => job?.id)
          .filter((jobId) => jobId !== undefined && jobId !== null)
          .map(String);

        if (!ignore) {
          setSavedJobIds(ids);
          setSaved(ids.includes(String(id)));
        }
      } catch (error) {
        console.error("GET SAVED JOBS ERROR:", error);

        if (!ignore) {
          setSavedJobIds([]);
        }
      }
    };

    fetchSavedJobs();

    return () => {
      ignore = true;
    };
  }, [id, role]);

  useEffect(() => {
    const updateRelatedPanelHeight = () => {
      const cardElement = jobDetailsCardRef.current;

      if (!cardElement || window.matchMedia("(max-width: 1200px)").matches) {
        setRelatedPanelHeight(null);
        return;
      }

      const nextHeight = Math.round(cardElement.getBoundingClientRect().height);
      setRelatedPanelHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight
      );
    };

    updateRelatedPanelHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateRelatedPanelHeight)
        : null;

    if (resizeObserver && jobDetailsCardRef.current) {
      resizeObserver.observe(jobDetailsCardRef.current);
    }

    window.addEventListener("resize", updateRelatedPanelHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateRelatedPanelHeight);
    };
  }, [job, loading, error, companyJobs.length]);

  const viewModel = useMemo(() => {
    const company = job?.company || {};
    const recruiter = job?.recruiter || {};
    return {
      title: job?.name || job?.title || "Tin tuyển dụng",
      logo: getLogoUrl(company.logo || job?.logo || job?.company_logo),
      companyName: getCompanyName(job),
      location: job?.location || company.location || "Chưa cập nhật",
      salary: formatSalary(job?.salary_min, job?.salary_max),
      experience: formatExperience(job?.exp_min, job?.exp_max),
      level: getName(job?.level || job?.level_name || job?.levelName),
      jobType: getName(
        job?.job_type || job?.job_type_name || job?.jobTypeName,
        "Chưa cập nhật"
      ),
      expire: formatDate(job?.expire),
      description: job?.description,
      requirement: job?.job_requirement || job?.requirement,
      benefit: job?.job_benefit || job?.benefit,
      recruiterName:
        recruiter.full_name ||
        recruiter.name ||
        job?.recruiter_name ||
        "Chưa cập nhật",
      recruiterPhone: recruiter.phone || job?.recruiter_phone || "Chưa cập nhật",
      recruiterEmail: recruiter.email || job?.recruiter_email || "Chưa cập nhật",
    };
  }, [job]);

  const relatedCompanyJobs = useMemo(() => {
    return companyJobs
      .filter((item) => String(item.id) !== String(id))
      .map((item) => {
        const mappedJob = mapJobCard(
          item,
          viewModel.companyName,
          viewModel.logo
        );

        return {
          ...mappedJob,
          isSaved:
            savedJobIds.includes(String(mappedJob.id)) || mappedJob.isSaved,
        };
      });
  }, [companyJobs, id, savedJobIds, viewModel.companyName, viewModel.logo]);

  const handleRelatedSavedChange = (jobId, nextSaved) => {
    setSavedJobIds((prevIds) => {
      const normalizedId = String(jobId);

      if (nextSaved) {
        return prevIds.includes(normalizedId)
          ? prevIds
          : [...prevIds, normalizedId];
      }

      return prevIds.filter((item) => item !== normalizedId);
    });
  };

  const handleApply = () => {
    if (!user?.id) {
      alert("Bạn cần đăng nhập để ứng tuyển.");
      navigate("/login");
      return;
    }

    if (role !== "candidate") {
      alert("Chỉ ứng viên mới có thể ứng tuyển.");
      return;
    }

    setShowApplyModal(true);
  };

  const handleToggleSave = async () => {
    try {
      if (!user?.id) {
        alert("Bạn cần đăng nhập để lưu việc làm.");
        navigate("/login");
        return;
      }

      if (role !== "candidate") {
        alert("Chỉ ứng viên mới có thể lưu việc làm.");
        return;
      }

      setSaving(true);

      if (saved) {
        await unsaveMyJobApi(id);
        setSaved(false);
        setSavedJobIds((prevIds) =>
          prevIds.filter((jobId) => jobId !== String(id))
        );
      } else {
        await saveMyJobApi(id);
        setSaved(true);
        setSavedJobIds((prevIds) =>
          prevIds.includes(String(id)) ? prevIds : [...prevIds, String(id)]
        );
      }
    } catch (error) {
      alert(getErrorMessage(error, "Thao tác lưu việc làm thất bại."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />

      <div className="job-details-container">
        {roleSidebar}
        <div className="job-details">
          <div className="job-details-posting-container">
            <div className="job-details-card" ref={jobDetailsCardRef}>
              {loading ? (
                <div className="job-details-state">Đang tải thông tin việc làm...</div>
              ) : error ? (
                <div className="job-details-state error">{error}</div>
              ) : !job ? (
                <div className="job-details-state">Không tìm thấy việc làm.</div>
              ) : (
                <>
                  <div className="job-details-hero">
                    <div className="company-badge">
                      <div className="company-left">
                        <img
                          className="logo"
                          src={viewModel.logo}
                          alt="Company Logo"
                          onError={(event) => {
                            event.currentTarget.src = logoDefault;
                          }}
                        />

                        <div className="job-details-title-infor">
                          <h1 className="job-details-title">{viewModel.title}</h1>

                          <button
                            className="company-name company-name-link"
                            type="button"
                            onClick={() =>
                              companyId && navigate(`/company-detail/${companyId}`)
                            }
                          >
                            {viewModel.companyName}
                          </button>
                        </div>
                      </div>

                      <div className="job-details-button">
                        <button className="apply-button" onClick={handleApply}>
                          Ứng tuyển ngay
                        </button>

                        <button
                          className={`save-button ${saved ? "saved" : ""}`}
                          onClick={handleToggleSave}
                          disabled={saving}
                        >
                          <span className="material-symbols-outlined">
                            {saved ? "bookmark_added" : "favorite"}
                          </span>
                          {saved ? "Đã lưu" : "Lưu tin"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="job-details-info-grid">
                    <div className="info-box">
                      <span className="info-label">Mức lương</span>
                      <span className="info-value">{viewModel.salary}</span>
                    </div>

                    <div className="info-box">
                      <span className="info-label">Địa điểm</span>
                      <span className="info-value">{viewModel.location}</span>
                    </div>

                    <div className="info-box">
                      <span className="info-label">Kinh nghiệm</span>
                      <span className="info-value">{viewModel.experience}</span>
                    </div>

                    <div className="info-box">
                      <span className="info-label">Cấp bậc</span>
                      <span className="info-value">{viewModel.level}</span>
                    </div>
                  </div>

                  <div className="job-details-content">
                    <div className="main-column">
                      <section className="job-details-section">
                        <h2>Mô tả công việc</h2>
                        <div className="section-text">
                          {renderText(viewModel.description)}
                        </div>
                      </section>

                      <section className="job-details-section">
                        <h2>Yêu cầu</h2>
                        <div className="section-text">
                          {renderText(viewModel.requirement)}
                        </div>
                      </section>

                      <section className="job-details-section">
                        <h2>Quyền lợi</h2>
                        <div className="section-text">{renderText(viewModel.benefit)}</div>
                      </section>
                    </div>

                    <div className="sidebar-column">
                      <div className="info-card purple-card">
                        <h3>CHI TIẾT CÔNG VIỆC</h3>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">schedule</span>
                          <p>Hình thức làm việc: {viewModel.jobType}</p>
                        </div>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">
                            calendar_month
                          </span>
                          <p>Hạn chót ứng tuyển: {viewModel.expire}</p>
                        </div>
                      </div>

                      <div className="info-card purple-card">
                        <h3>THÔNG TIN NGƯỜI TUYỂN DỤNG</h3>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">person</span>
                          <p>{viewModel.recruiterName}</p>
                        </div>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">phone</span>
                          <p>{viewModel.recruiterPhone}</p>
                        </div>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">email</span>
                          <p>{viewModel.recruiterEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div
            className="list-jobs"
            style={
              relatedPanelHeight
                ? { height: `${relatedPanelHeight}px` }
                : undefined
            }
          >
            <h2 className="list-jobs-title">Công việc cùng công ty</h2>

            <div className="related-jobs-list">
              {relatedLoading ? (
                <div className="related-jobs-state">Đang tải việc làm...</div>
              ) : relatedError ? (
                <div className="related-jobs-state error">{relatedError}</div>
              ) : relatedCompanyJobs.length > 0 ? (
                relatedCompanyJobs.map((job) => (
                  <ComponentJob
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    logo={job.logo}
                    company_name={job.company_name}
                    location={job.location}
                    salary={job.salary}
                    isSaved={job.isSaved}
                    onSavedChange={handleRelatedSavedChange}
                    onClick={() => navigate(`/job-details/${job.id}`)}
                  />
                ))
              ) : (
                <div className="related-jobs-state">
                  Chưa có công việc khác trong cùng công ty.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyJobModal jobId={id} onClose={() => setShowApplyModal(false)} />
      )}

      <Footer />
    </>
  );
}

export default Job_Details;
