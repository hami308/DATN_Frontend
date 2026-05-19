import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MenuCard from "../../components/MenuCard/MenuCard";
import SideBar from "../../components/Sidebar/Sidebar";
import Component_job from "../../components/component_job/component_job";
import { getJobDetailApi } from "../../service/job/job_detail";
import { getMyCompanyJobsApi } from "../../service/job/my_company_jobs";
import ApplyJobModal from "../../components/ApplyJobModal/ApplyJobModal";
import {
  getMySavedJobsApi,
  saveMyJobApi,
  unsaveMyJobApi,
} from "../../service/candidate/savedJob.service";
import "./Job_Details.css";

import Logo from "../../assets/images/logo.png";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  return (
    error?.message ||
    error?.data?.message ||
    error?.error ||
    "Không thể tải chi tiết tin tuyển dụng."
  );
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "";

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) return "";

  return `${new Intl.NumberFormat("vi-VN").format(numberValue)} triệu VND`;
};

const formatSalary = (min, max) => {
  const minSalary = formatCurrency(min);
  const maxSalary = formatCurrency(max);

  if (minSalary && maxSalary) return `${minSalary} - ${maxSalary}`;
  if (minSalary) return `Từ ${minSalary}`;
  if (maxSalary) return `Đến ${maxSalary}`;

  return "Thỏa thuận";
};

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN").format(date);
};

const formatExperience = (min, max) => {
  const minExp = min === null || min === undefined ? "" : Number(min);
  const maxExp = max === null || max === undefined ? "" : Number(max);

  if (minExp !== "" && maxExp !== "") return `${minExp} - ${maxExp} năm`;
  if (minExp !== "") return `Từ ${minExp} năm`;
  if (maxExp !== "") return `Đến ${maxExp} năm`;

  return "Không yêu cầu";
};

const getText = (value, fallback = "Chưa cập nhật") => {
  if (value === null || value === undefined || value === "") return fallback;

  return value;
};

function Job_Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const [job, setJob] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  useEffect(() => {
    const fetchSavedStatus = async () => {
      try {
        if (role !== "candidate") return;

        const response = await getMySavedJobsApi();
        const savedJobs = response?.data?.data?.jobs || [];

        const saved = savedJobs.some((job) => Number(job.id) === Number(id));

        setIsSaved(saved);
      } catch (error) {
        console.error("GET SAVED STATUS ERROR:", error);
      }
    };

    fetchSavedStatus();
  }, [id, role]);
  useEffect(() => {
    let isMounted = true;

    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJobDetailApi(id);

        if (isMounted) {
          setJob(response?.data?.job || null);
        }
      } catch (error) {
        if (isMounted) {
          setError(getErrorMessage(error));
          setJob(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const fetchCompanyJobs = async () => {
      try {
        setRelatedLoading(true);

        const response = await getMyCompanyJobsApi({ status: 1 });
        const jobs = response?.data?.jobs || [];

        if (isMounted) {
          setCompanyJobs(jobs);
        }
      } catch {
        if (isMounted) {
          setCompanyJobs([]);
        }
      } finally {
        if (isMounted) {
          setRelatedLoading(false);
        }
      }
    };

    fetchCompanyJobs();

    return () => {
      isMounted = false;
    };
  }, []);

  const viewModel = useMemo(() => {
    if (!job) return null;

    const company = job.company || {};
    const recruiter = job.recruiter || {};
    const industries = Array.isArray(job.industries) ? job.industries : [];

    return {
      title: getText(job.name, "Tin tuyển dụng"),
      logo: company.logo || Logo,
      companyId: company.company_id || job.company_id,
      companyName: getText(company.name, "Chưa cập nhật công ty"),
      companyDescription: getText(company.description, ""),
      salary: formatSalary(job.salary_min, job.salary_max),
      location: getText(job.location || company.location),
      experience: formatExperience(job.exp_min, job.exp_max),
      level: getText(job.level_name || job.level?.name),
      description: getText(job.description),
      requirement: getText(job.job_requirement),
      benefit: getText(job.job_benefit),
      jobType: getText(job.job_type_name || job.job_type?.name),
      expire: formatDate(job.expire),
      candidateNumber: getText(job.candidate_number),
      industries: industries.map((industry) => industry.name).join(", "),
      recruiterName: getText(recruiter.full_name),
      recruiterPhone: getText(recruiter.phone),
    };
  }, [job]);

  const relatedCompanyJobs = useMemo(() => {
    if (!viewModel) return [];

    return companyJobs
      .filter((item) => String(item.id) !== String(id))
      .filter((item) => Number(item.status) === 1)
      .filter(
        (item) =>
          !viewModel.companyId ||
          !item.company_id ||
          String(item.company_id) === String(viewModel.companyId),
      )
      .map((item) => ({
        id: item.id,
        title: item.name || "Tin tuyển dụng",
        logo: viewModel.logo,
        company_name: viewModel.companyName,
        location: item.location || viewModel.location,
        salary: formatSalary(item.salary_min, item.salary_max),
      }));
  }, [companyJobs, id, viewModel]);
  const handleToggleSaveJob = async () => {
    try {
      if (!user?.id) {
        alert("Bạn cần đăng nhập để lưu việc làm.");
        return;
      }

      if (role !== "candidate") {
        alert("Chỉ ứng viên mới có thể lưu việc làm.");
        return;
      }

      setSaveLoading(true);

      if (isSaved) {
        await unsaveMyJobApi(id);
        setIsSaved(false);
        return;
      }

      await saveMyJobApi(id);
      setIsSaved(true);
    } catch (error) {
      alert(
        error?.message ||
          error?.data?.message ||
          "Thao tác lưu việc làm thất bại.",
      );
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <>
      <Header />

      <div className="job-details-container">
        {role === "candidate" ? <SideBar /> : <MenuCard />}

        <main className="job-details">
          <section className="job-details-posting-container">
            <div className="job-details-card">
              {loading ? (
                <div className="job-details-state">
                  Đang tải chi tiết tin...
                </div>
              ) : error ? (
                <div className="job-details-state error">{error}</div>
              ) : viewModel ? (
                <>
                  <div className="job-details-hero">
                    <div className="company-badge">
                      <div className="company-left">
                        <img
                          className="logo"
                          src={viewModel.logo}
                          alt="Company Logo"
                        />

                        <div className="job-details-title-infor">
                          <h1 className="job-details-title">
                            {viewModel.title}
                          </h1>
                          <span className="company-name">
                            {viewModel.companyName}
                          </span>
                        </div>
                      </div>

                      <div className="job-details-button">
                        <button
                          className="apply-button"
                          onClick={() => setShowApplyModal(true)}
                        >
                          Ứng tuyển ngay
                        </button>

                        <button
                          className={`save-button ${isSaved ? "saved" : ""}`}
                          onClick={handleToggleSaveJob}
                          disabled={saveLoading}
                        >
                          <span className="material-symbols-outlined">
                            favorite
                          </span>

                          {saveLoading
                            ? "Đang xử lý..."
                            : isSaved
                              ? "Đã lưu"
                              : "Lưu tin"}
                        </button>
                      </div>
                    </div>

                    {viewModel.companyDescription && (
                      <p className="company-summary">
                        {viewModel.companyDescription}
                      </p>
                    )}
                  </div>

                  <div className="job-details-info-grid">
                    <div className="info-box">
                      <span className="material-symbols-outlined">
                        payments
                      </span>
                      <span className="info-label">Mức lương</span>
                      <span className="info-value">{viewModel.salary}</span>
                    </div>

                    <div className="info-box">
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      <span className="info-label">Địa điểm</span>
                      <span className="info-value">{viewModel.location}</span>
                    </div>

                    <div className="info-box">
                      <span className="material-symbols-outlined">
                        timeline
                      </span>
                      <span className="info-label">Kinh nghiệm</span>
                      <span className="info-value">{viewModel.experience}</span>
                    </div>

                    <div className="info-box">
                      <span className="material-symbols-outlined">
                        workspace_premium
                      </span>
                      <span className="info-label">Cấp bậc</span>
                      <span className="info-value">{viewModel.level}</span>
                    </div>
                  </div>

                  <div className="job-details-content">
                    <div className="main-column">
                      <section className="job-details-section">
                        <h2>Mô tả công việc</h2>
                        <div className="section-text">
                          <p>{viewModel.description}</p>
                        </div>
                      </section>

                      <section className="job-details-section">
                        <h2>Yêu cầu ứng viên</h2>
                        <div className="section-text">
                          <p>{viewModel.requirement}</p>
                        </div>
                      </section>

                      <section className="job-details-section">
                        <h2>Quyền lợi</h2>
                        <div className="section-text">
                          <p>{viewModel.benefit}</p>
                        </div>
                      </section>
                    </div>

                    <aside className="sidebar-column">
                      <div className="info-card">
                        <h3>Chi tiết công việc</h3>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">
                            schedule
                          </span>
                          <p>Hình thức: {viewModel.jobType}</p>
                        </div>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">
                            calendar_month
                          </span>
                          <p>Hạn ứng tuyển: {viewModel.expire}</p>
                        </div>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">
                            groups
                          </span>
                          <p>Số lượng tuyển: {viewModel.candidateNumber}</p>
                        </div>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">
                            work
                          </span>
                          <p>
                            Lĩnh vực: {viewModel.industries || "Chưa cập nhật"}
                          </p>
                        </div>
                      </div>

                      <div className="info-card">
                        <h3>Người tuyển dụng</h3>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">
                            person
                          </span>
                          <p>{viewModel.recruiterName}</p>
                        </div>

                        <div className="detail-item">
                          <span className="material-symbols-outlined">
                            phone
                          </span>
                          <p>{viewModel.recruiterPhone}</p>
                        </div>
                      </div>
                    </aside>
                  </div>
                </>
              ) : (
                <div className="job-details-state">
                  Không tìm thấy tin tuyển dụng.
                </div>
              )}
            </div>
          </section>

          <aside className="list-jobs">
            <h2 className="list-jobs-title">Công việc cùng công ty</h2>

            <div className="related-jobs-list">
              {relatedLoading ? (
                <div className="related-jobs-state">Đang tải...</div>
              ) : relatedCompanyJobs.length > 0 ? (
                relatedCompanyJobs.map((job) => (
                  <Component_job
                    key={job.id}
                    title={job.title}
                    logo={job.logo}
                    company_name={job.company_name}
                    location={job.location}
                    salary={job.salary}
                    onClick={() => navigate(`/job-details/${job.id}`)}
                  />
                ))
              ) : (
                <div className="related-jobs-state">
                  Chưa có công việc khác trong cùng công ty.
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>

      <Footer />
      {showApplyModal && (
        <ApplyJobModal jobId={id} onClose={() => setShowApplyModal(false)} />
      )}
    </>
  );
}

export default Job_Details;
