import { useCallback, useEffect, useState } from "react";
import styles from "./CV_management_form.module.css";

import JobCard from "../../../components/JobCard/JobCard";
import Pagination from "../../../components/Pagination/Pagination";
import logoDefault from "../../../assets/images/logo.png";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

import {
  getMyCVsApi,
  uploadMyCVApi,
  deleteMyCVApi,
  setDefaultCVApi,
  getCVFileUrl,
  getCVDisplayName,
} from "../../../service/cv/cv_service";
import { getMyRecommendedJobsApi } from "../../../service/candidate/recommendedJob.service";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const renderPdfPreview = async (url) => {
  const pdf = await pdfjsLib.getDocument(url).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 1.2 });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return canvas.toDataURL("image/png");
};

const getCVsFromResponse = (response) => {
  return response?.data?.data || [];
};

const getRecommendedJobsFromResponse = (response) => {
  return response?.data?.data?.jobs || [];
};
const getDefaultCvId = (cvList) => {
  return cvList.find((cv) => cv.is_default)?.id || null;
};
export default function CVManagement() {
  const [cvs, setCvs] = useState([]);
  const [previewMap, setPreviewMap] = useState({});
  const [pageLoading, setPageLoading] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendedError, setRecommendedError] = useState("");

  const [actionLoading, setActionLoading] = useState({
    upload: false,
    defaultId: null,
    deleteId: null,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const LoadingIcon = () => <span className={styles.spinner}></span>;

  const loadRecommendedJobs = useCallback(async () => {
    try {
      setRecommendedLoading(true);
      setRecommendedError("");

      const response = await getMyRecommendedJobsApi();
      const jobs = getRecommendedJobsFromResponse(response);

      setRecommendedJobs(jobs);
      setCurrentPage(1);
    } catch (err) {
      setRecommendedJobs([]);
      setRecommendedError(
        err?.message ||
          err?.data?.message ||
          "Không thể lấy danh sách việc làm phù hợp.",
      );
    } finally {
      setRecommendedLoading(false);
    }
  }, []);
  const loadPreviewImages = async (cvList) => {
    const previews = {};

    for (const cv of cvList) {
      if (cv.file_url) {
        const fileUrl = getCVFileUrl(cv.file_url);
        previews[cv.id] = await renderPdfPreview(fileUrl);
      }
    }

    setPreviewMap(previews);
  };
  const loadMyCVs = useCallback(async () => {
    try {
      setPageLoading(true);

      const response = await getMyCVsApi();
      const cvList = getCVsFromResponse(response);

      setCvs(cvList);
      await loadPreviewImages(cvList);
    } catch (err) {
      alert(err?.message || err?.data?.message || "Lấy danh sách CV thất bại.");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyCVs();
    loadRecommendedJobs();
  }, [loadMyCVs, loadRecommendedJobs]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Chỉ upload file PDF");
      return;
    }

    const oldDefaultCvId = getDefaultCvId(cvs);
    try {
      setActionLoading((prev) => ({
        ...prev,
        upload: true,
      }));

      await uploadMyCVApi(file);

      const response = await getMyCVsApi();
      const newCvList = getCVsFromResponse(response);

      setCvs(newCvList);
      await loadPreviewImages(newCvList);

      const newDefaultCvId = getDefaultCvId(newCvList);

      if (oldDefaultCvId !== newDefaultCvId) {
        await loadRecommendedJobs();
      }
    } catch (err) {
      alert(err?.message || err?.data?.message || "Tải lên CV thất bại.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        upload: false,
      }));

      e.target.value = "";
    }
  };

  const handleSetDefault = async (cvId) => {
    try {
      setActionLoading((prev) => ({
        ...prev,
        defaultId: cvId,
      }));

      await setDefaultCVApi(cvId);

      await loadMyCVs();
      await loadRecommendedJobs();

      // alert(response.data.message || "Đặt CV mặc định thành công.");
    } catch (err) {
      alert(err?.message || err?.data?.message || "Đặt CV mặc định thất bại.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        defaultId: null,
      }));
    }
  };

  const handleDelete = async (cvId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa CV này không?");

    if (!confirmDelete) return;
    const oldDefaultCvId = getDefaultCvId(cvs);
    try {
      setActionLoading((prev) => ({
        ...prev,
        deleteId: cvId,
      }));

      await deleteMyCVApi(cvId);

      const response = await getMyCVsApi();
      const newCvList = getCVsFromResponse(response);

      setCvs(newCvList);
      await loadPreviewImages(newCvList);

      const newDefaultCvId = getDefaultCvId(newCvList);

      if (oldDefaultCvId !== newDefaultCvId) {
        await loadRecommendedJobs();
      }

      // alert(response.data.message || "Xóa CV thành công.");
    } catch (err) {
      alert(err?.message || err?.data?.message || "Xóa CV thất bại.");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        deleteId: null,
      }));
    }
  };

  const jobsPerPage = 5;
  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = recommendedJobs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(recommendedJobs.length / jobsPerPage);

  if (pageLoading) {
    return (
      <div className={styles.pageLoading}>
        <LoadingIcon />
        Loading ...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý CV của bạn</h2>

      <div className={styles.cvPanel}>
        <label
          className={`${styles.uploadBox} ${
            actionLoading.upload ? styles.disabledBox : ""
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleUpload}
            disabled={actionLoading.upload}
          />

          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon}>☁</div>

            <div>
              {actionLoading.upload ? (
                <>
                  <LoadingIcon />
                  Đang tải CV...
                </>
              ) : (
                "Chọn hoặc kéo thả file vào đây"
              )}
            </div>

            <span>Chỉ chấp nhận định dạng file PDF.</span>
          </div>
        </label>
        
        <div className={styles.cvList}>
          {cvs.map((cv) => {
            const fileUrl = getCVFileUrl(cv.file_url);
            const fileName = getCVDisplayName(cv);

            return (
              <div key={cv.id} className={styles.preview}>
                <div onClick={() => window.open(fileUrl, "_blank")}>
                  {previewMap[cv.id] ? (
                    <img
                      src={previewMap[cv.id]}
                      alt="CV preview"
                      className={styles.cvFrame}
                    />
                  ) : (
                    <div className={styles.previewLoading}>
                      <LoadingIcon />
                      Đang tải preview...
                    </div>
                  )}
                </div>

                <div className={styles.cvInfo}>
                  <div className={styles.cvName}>
                    {fileName}
                    {cv.is_default && " - Mặc định"}
                  </div>

                  <span>
                    Cập nhật vào{" "}
                    {new Date(cv.created_at).toLocaleDateString("vi-VN")}
                  </span>

                  <div className={styles.actions}>
                    {!cv.is_default && (
                      <button
                        type="button"
                        disabled={actionLoading.defaultId === cv.id}
                        onClick={() => handleSetDefault(cv.id)}
                      >
                        {actionLoading.defaultId === cv.id ? (
                          <>
                            <LoadingIcon />
                            Đang đặt...
                          </>
                        ) : (
                          "Đặt mặc định"
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={actionLoading.deleteId === cv.id}
                      onClick={() => handleDelete(cv.id)}
                    >
                      {actionLoading.deleteId === cv.id ? (
                        <>
                          <LoadingIcon />
                          Đang xóa...
                        </>
                      ) : (
                        "Xóa"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {cvs.length > 0 && (
        <div className={styles.jobSection}>
          <h2>Việc làm phù hợp</h2>

          <div className={styles.list}>
            {recommendedLoading && (
              <p className={styles.jobMessage}>
                <LoadingIcon />
                Đang tải việc làm phù hợp...
              </p>
            )}

            {!recommendedLoading && recommendedError && (
              <p className={styles.error}>{recommendedError}</p>
            )}

            {!recommendedLoading &&
              !recommendedError &&
              currentJobs.map((job) => (
                <div key={job.id} className={styles.recommendedJob}>
                  <JobCard
                    id={job.id}
                    logo={job.company?.logo || logoDefault}
                    title={job.name}
                    type={job.job_type?.name || "Chưa cập nhật"}
                    location={job.location || "Chưa cập nhật"}
                    salaryMin={job.salary_min}
                    salaryMax={job.salary_max}
                    deadline={job.expire}
                  />
                </div>
              ))}

            {!recommendedLoading &&
              !recommendedError &&
              recommendedJobs.length === 0 && (
                <p className={styles.jobMessage}>
                  Chưa có việc làm phù hợp với CV mặc định của bạn.
                </p>
              )}

            {!recommendedLoading &&
              !recommendedError &&
              recommendedJobs.length > 0 && (
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
      )}
    </div>
  );
}
