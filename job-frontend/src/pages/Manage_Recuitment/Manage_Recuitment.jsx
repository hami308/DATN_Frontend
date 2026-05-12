import React, { useState } from "react";
import JobComponent from "../../components/Job_component/Job_component";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Manage_Recuitment.css";
import MenuCard from "../../components/MenuCard/MenuCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";

function ManageRecuitment() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  const jobs = [
    {
      logo: null,
      title: "Senior UX Designer",
      type: "Part Time",
      location: "Đà Nẵng",
      salary: "$30K–$35K",
      deadline: "Còn 4 ngày",
      status: "Đang Hiển Thị",
      role: "Recuiter",
    },
    {
      logo: null,
      title: "Frontend Developer",
      type: "Full Time",
      location: "Hà Nội",
      salary: "$25K–$30K",
      deadline: "Còn 7 ngày",
      status: "Đang Hiển Thị",
      role: "Candidate",
    },
    {
      logo: null,
      title: "Backend Engineer",
      type: "Full Time",
      location: "TP. Hồ Chí Minh",
      salary: "$35K–$40K",
      deadline: "Còn 10 ngày",
      status: "Đang Hiển Thị",
      role: "Recuiter",
    },
    {
      logo: null,
      title: "Senior UX Designer",
      type: "Part Time",
      location: "Đà Nẵng",
      salary: "$30K–$35K",
      deadline: "Còn 4 ngày",
      status: "Đang Hiển Thị",
      role: "Recuiter",
    },
    {
      logo: null,
      title: "Frontend Developer",
      type: "Full Time",
      location: "Hà Nội",
      salary: "$25K–$30K",
      deadline: "Còn 7 ngày",
      status: "Đang Hiển Thị",
      role: "Candidate",
    },

  ];

  // Tổng số trang
  const totalPages = Math.ceil(jobs.length / limit);

  // Cắt data theo trang
  const startIndex = (currentPage - 1) * limit;
  const currentJobs = jobs.slice(startIndex, startIndex + limit);

  return (
    <>
      <Header />
      <div className="manage-recuitment-container">
        <MenuCard />
        <div className="manage-recuitment-content">
          <div className="manage-recuitment-header">
            <h2 className="manage-job-title">
              Danh sách các tin tuyển dụng
            </h2>
            <SearchBar />
          </div>

          <div className="manage-job-list">
            {currentJobs.map((job, index) => (
              <JobComponent
                key={index}
                logo={job.logo}
                title={job.title}
                type={job.type}
                location={job.location}
                salary={job.salary}
                deadline={job.deadline}
                status={job.status}
                role={job.role}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ManageRecuitment;