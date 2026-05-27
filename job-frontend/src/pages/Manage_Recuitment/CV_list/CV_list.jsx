import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import MenuCard from "../../../components/MenuCard/MenuCard";
import {
  approveJobApplicationApi,
  getJobApplicationsApi,
  rejectJobApplicationApi,
} from "../../../service/job/job_applications";
import { getJobDetailApi } from "../../../service/job/job_detail";
import { getCVFileUrl } from "../../../service/cv/cv_service";
import "./CV_list.css";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  return (
    error?.message ||
    error?.data?.message ||
    error?.error ||
    "Không thể tải danh sách ứng viên."
  );
};

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN").format(date);
};

const normalizeStatus = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (["approved", "accept", "accepted", "1", "đã duyệt"].includes(normalized)) {
    return "approved";
  }

  if (["rejected", "reject", "0", "đã từ chối"].includes(normalized)) {
    return "rejected";
  }

  if (["viewed", "seen", "2", "đã xem"].includes(normalized)) {
    return "viewed";
  }

  return "pending";
};

const statusLabels = {
  pending: "Chưa xử lý",
  viewed: "Đã xem",
  approved: "Đã duyệt",
  rejected: "Đã từ chối",
};

const getStatusBadge = (status) => {
  const base = "cv-list-status-badge";
  const normalizedStatus = normalizeStatus(status);

  return `${base} cv-list-status-${normalizedStatus}`;
};

const getCandidateName = (application) => {
  return application?.candidate?.full_name || "Chưa cập nhật";
};

const getCandidateEmail = (application) => {
  return application?.candidate?.email || "Chưa cập nhật";
};

const getCandidatePhone = (application) => {
  return application?.candidate?.phone || "Chưa cập nhật";
};

const CV_list = () => {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("Danh sách ứng viên");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectCandidate, setRejectCandidate] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const [expandedReasonId, setExpandedReasonId] = useState(null);

  useEffect(() => {
    if (!jobId) {
      setError("Thiếu mã tin tuyển dụng.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [applicationsResponse, jobResponse] = await Promise.all([
          getJobApplicationsApi(jobId),
          getJobDetailApi(jobId),
        ]);
        if (isMounted) {
          const applicationData = applicationsResponse?.data?.applications || [];

          setApplications(applicationData);
          setTotal(applicationsResponse?.data?.total ?? applicationData.length);
          setJobTitle(
            jobResponse?.data?.job?.name || `Danh sách ứng viên tin #${jobId}`
          );
        }
      } catch (error) {
        if (isMounted) {
          setError(getErrorMessage(error));
          setApplications([]);
          setTotal(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const candidateRows = useMemo(
    () =>
      applications.map((application) => ({
        id: application.id,
        name: getCandidateName(application),
        email: getCandidateEmail(application),
        phone: getCandidatePhone(application),
        submissionDate: formatDate(application.created_at),
        status: normalizeStatus(application.status),
        rejectReason: application.reason_reject || "",
        cvUrl: getCVFileUrl(application.cv?.file_url),
        raw: application,
      })),
    [applications]
  );

  const handleView = (candidate) => {
    if (!candidate?.cvUrl) {
      alert(
        `Thông tin ứng viên:\nHọ tên: ${candidate.name}\nEmail: ${candidate.email}\nSĐT: ${candidate.phone}\nNgày nộp: ${candidate.submissionDate}`
      );
      return;
    }

    window.open(candidate.cvUrl, "_blank", "noopener,noreferrer");
  };

  const updateApplicationStatus = async (
    candidate,
    status,
    reasonReject = ""
  ) => {
    try {
      setActionLoadingId(candidate.id);

      const response =
        status === "approved"
          ? await approveJobApplicationApi(candidate.id)
          : await rejectJobApplicationApi(candidate.id, {
              reasonReject,
              reason_reject: reasonReject,
            });

      const updatedApplication = response?.data?.application || response?.data || null;

      setApplications((prevApplications) =>
        prevApplications.map((application) => {
          if (Number(application.id) !== Number(candidate.id)) {
            return application;
          }

          return updatedApplication?.id
            ? updatedApplication
            : {
                ...application,
                status,
                approved_at:
                  status === "approved"
                    ? new Date().toISOString()
                    : application.approved_at,
                reason_reject:
                  status === "rejected"
                    ? reasonReject
                    : application.reason_reject,
              };
        })
      );
    } catch (error) {
      alert(getErrorMessage(error));
      return false;
    } finally {
      setActionLoadingId(null);
    }

    return true;
  };

  const handleApprove = (candidate) => {
    updateApplicationStatus(candidate, "approved");
  };

  const handleReject = (candidate) => {
    setRejectCandidate(candidate);
    setRejectReason(candidate.rejectReason || "");
    setRejectError("");
  };

  const closeRejectPopup = () => {
    if (actionLoadingId === rejectCandidate?.id) return;

    setRejectCandidate(null);
    setRejectReason("");
    setRejectError("");
  };

  const submitReject = async () => {
    const normalizedReason = rejectReason.trim();

    if (!normalizedReason) {
      setRejectError("Vui lòng nhập lý do từ chối hồ sơ.");
      return;
    }

    const isSuccess = await updateApplicationStatus(
      rejectCandidate,
      "rejected",
      normalizedReason
    );

    if (isSuccess) {
      setRejectCandidate(null);
      setRejectReason("");
      setRejectError("");
    }
  };

  const renderRejectReason = (candidate) => {
    if (candidate.status !== "rejected" || !candidate.rejectReason) {
      return "—";
    }

    const maxLength = 35;
    const reason = candidate.rejectReason;
    const isExpanded = expandedReasonId === candidate.id;

    if (reason.length <= maxLength) {
      return <span>{reason}</span>;
    }

    return (
      <button
        type="button"
        className="cv-list-reason-toggle"
        onClick={() => setExpandedReasonId(isExpanded ? null : candidate.id)}
        title={isExpanded ? "Thu gọn" : "Xem thêm"}
      >
        {isExpanded ? reason : `${reason.slice(0, maxLength)}...`}
      </button>
    );
  };

  return (
    <>
      <Header />

      <div className="cv-list-container">
        <MenuCard />

        <div className="cv-list-dashboard-container">
          <div className="cv-list-dashboard-header">
            <div>
              <span className="cv-list-eyebrow">Ứng viên đã ứng tuyển</span>
              <h1 className="cv-list-position-title">{jobTitle}</h1>
            </div>

            <div className="cv-list-stats-badge">Tổng hồ sơ: {total}</div>
          </div>

          {loading ? (
            <div className="cv-list-state">Đang tải danh sách ứng viên...</div>
          ) : error ? (
            <div className="cv-list-state error">{error}</div>
          ) : candidateRows.length > 0 ? (
            <div className="cv-list-table-wrapper">
              <table className="cv-list-candidates-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Ngày nộp</th>
                    <th>Trạng thái</th>
                    <th>Lý do từ chối</th>
                    <th>Hành động</th>
                  </tr>
                </thead>

                <tbody>
                  {candidateRows.map((candidate) => (
                    <tr key={candidate.id}>
                      <td className="cv-list-candidate-name">
                        {candidate.name}
                      </td>

                      <td>{candidate.submissionDate}</td>

                      <td>
                        <span className={getStatusBadge(candidate.status)}>
                          {statusLabels[candidate.status]}
                        </span>
                      </td>

                      <td className="cv-list-reject-reason-cell">
                        {renderRejectReason(candidate)}
                      </td>

                      <td className="cv-list-action-buttons">
                        <button
                          className="cv-list-btn-view"
                          onClick={() => handleView(candidate)}
                        >
                          <span className="material-symbols-outlined">
                            visibility
                          </span>
                          Xem
                        </button>

                        <button
                          className="cv-list-btn-approve"
                          disabled={
                            actionLoadingId === candidate.id ||
                            candidate.status === "approved"
                          }
                          onClick={() => handleApprove(candidate)}
                        >
                          <span className="material-symbols-outlined">
                            check_small
                          </span>
                          Duyệt
                        </button>

                        <button
                          className="cv-list-btn-reject"
                          disabled={
                            actionLoadingId === candidate.id ||
                            candidate.status === "rejected"
                          }
                          onClick={() => handleReject(candidate)}
                        >
                          <span className="material-symbols-outlined">
                            person_cancel
                          </span>
                          Từ chối
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="cv-list-state">
              Chưa có ứng viên nào ứng tuyển tin này.
            </div>
          )}
        </div>
      </div>

      {rejectCandidate && (
        <div className="cv-list-reject-popup-overlay">
          <div className="cv-list-reject-popup">
            <div className="cv-list-reject-popup-header">
              <h2>Từ chối hồ sơ</h2>

              <button
                type="button"
                className="cv-list-reject-popup-close"
                onClick={closeRejectPopup}
                aria-label="Đóng popup"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="cv-list-reject-popup-desc">
              Nhập lý do từ chối hồ sơ của {rejectCandidate.name}.
            </p>

            <textarea
              className="cv-list-reject-textarea"
              value={rejectReason}
              onChange={(event) => {
                setRejectReason(event.target.value);
                setRejectError("");
              }}
              placeholder="Ví dụ: Kinh nghiệm chưa phù hợp với yêu cầu tuyển dụng..."
              rows={5}
            />

            {rejectError && (
              <div className="cv-list-reject-error">{rejectError}</div>
            )}

            <div className="cv-list-reject-popup-actions">
              <button
                type="button"
                className="cv-list-reject-cancel"
                onClick={closeRejectPopup}
              >
                Hủy
              </button>

              <button
                type="button"
                className="cv-list-reject-submit"
                disabled={actionLoadingId === rejectCandidate.id}
                onClick={submitReject}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CV_list;
