import { useState } from "react";
import styles from "./CV_management_form.module.css";
import JobCard from "../../../components/JobCard/JobCard";
import Pagination from "../../../components/Pagination/Pagination";
import logo from "../../../assets/image/logo.png";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function CVManagement() {
  const [cvUrl, setCvUrl] = useState(null);
  const [cvName, setCvName] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Chỉ upload file PDF");
      return;
    }

    const url = URL.createObjectURL(file);
    setCvUrl(url);
    setCvName(file.name);

    // render page 1 thành ảnh
    const pdf = await pdfjsLib.getDocument(url).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 1.5 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const img = canvas.toDataURL("image/png");
    setPreviewImg(img);
  };

  const jobCards = [
    {
      logo: logo,
      title: "Frontend React Developer",
      type: "Full Time",
      location: "Đà Nẵng",
      salary_min: 20000,
      salary_max: 30000,
      deadline: "Còn 5 ngày",
    },
    {
      logo: logo,
      title: "Backend NodeJS",
      type: "Full Time",
      location: "Hà Nội",
      salary_min: 25000,
      salary_max: 35000,
      deadline: "Còn 3 ngày",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const indexOfLast = currentPage * jobsPerPage;
  const indexOfFirst = indexOfLast - jobsPerPage;
  const currentJobs = jobCards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(jobCards.length / jobsPerPage);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tải lên CV của bạn</h2>

      <div className={styles.cvPanel}>
        {/* upload */}
        <label className={styles.uploadBox}>
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleUpload}
          />

          <div className={styles.uploadContent}>
            <div className={styles.uploadIcon}>☁</div>
            <div>Chọn hoặc kéo thả file vào đây</div>
            <span>Chỉ chấp nhận định dạng file PDF</span>
          </div>
        </label>

        {/* preview */}
        {previewImg && (
          <div
            className={styles.preview}
            onClick={() => window.open(cvUrl, "_blank")}
          >
            <img src={previewImg} alt="CV preview" className={styles.cvFrame} />

            <div className={styles.cvInfo}>
              <div className={styles.cvName}>{cvName}</div>
              <span>Cập nhật vào {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* job */}
      {previewImg && (
        <div className={styles.jobSection}>
          <h2>Việc làm phù hợp</h2>

          <div className={styles.list}>
            {currentJobs.map((job, index) => (
              <JobCard
                key={index}
                logo={job.logo}
                title={job.title}
                type={job.type}
                location={job.location}
                salary={job.salary_min + "VND–" + job.salary_max + "VND"}
                deadline={job.deadline}
              />
            ))}

            <div className={styles.paginationWrap}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
