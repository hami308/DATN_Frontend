import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MenuCard from "../../components/MenuCard/MenuCard";
import Component_job from "../../components/component_job/component_job";
import "./Job_Details.css";

import Logo from "../../assets/images/logo.png";
const relatedJobs = [
    {
        id: 1,
        title: "Senior UX Designer",
        logo: Logo,
        company_name: "ABC Group",
        location: "Đà Nẵng",
        salary: "10-20 triệu VNĐ",
    },
    {
        id: 2,
        title: "Frontend Developer",
        logo: Logo,
        company_name: "FPT Software",
        location: "Hồ Chí Minh",
        salary: "15-25 triệu VNĐ",
    },
    {
        id: 3,
        title: "Backend Developer",
        logo: Logo,
        company_name: "VNG Corporation",
        location: "Hà Nội",
        salary: "18-30 triệu VNĐ",
    },
    {
        id: 4,
        title: "UI Designer",
        logo: Logo,
        company_name: "Shopee",
        location: "Đà Nẵng",
        salary: "12-18 triệu VNĐ",
    },
];
function Job_Details() {

    return (
        <>
            <Header />

            <div className="job-details-container">
                <MenuCard />
                <div className="job-details">
                <div className="job-details-posting-container">
                    <div className="job-details-card">

                        {/* HEADER */}
                        <div className="job-details-header">
                            <div className="company-badge">

                                {/* LEFT */}
                                <div className="company-left">
                                    <img
                                        className="logo"
                                        src={Logo}
                                        alt="Company Logo"
                                    />

                                    <div className="job-details-title-infor">
                                        <h1 className="job-details-title">
                                            Senior UX Designer
                                        </h1>

                                        <span className="company-name">
                                            ABC Group
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="job-details-button">
                                    <button className="apply-button">
                                        Ứng tuyển ngay
                                    </button>

                                    <button className="save-button">
                                        <span className="material-symbols-outlined">
                                            favorite
                                        </span>

                                        Lưu tin
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* INFO GRID */}
                        <div className="job-details-info-grid">

                            <div className="info-box">
                                <span className="info-label">
                                    Mức lương
                                </span>

                                <span className="info-value">
                                    10-20 triệu VNĐ
                                </span>
                            </div>

                            <div className="info-box">
                                <span className="info-label">
                                    Địa điểm
                                </span>

                                <span className="info-value">
                                    Đà Nẵng
                                </span>
                            </div>

                            <div className="info-box">
                                <span className="info-label">
                                    Kinh nghiệm
                                </span>

                                <span className="info-value">
                                    5 năm
                                </span>
                            </div>

                            <div className="info-box">
                                <span className="info-label">
                                    Cấp bậc
                                </span>

                                <span className="info-value">
                                    Senior
                                </span>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="job-details-content">

                            {/* LEFT */}
                            <div className="main-column">

                                {/* DESCRIPTION */}
                                <section className="job-details-section">
                                    <h2>Mô tả công việc</h2>

                                    <div className="section-text">
                                        <p>
                                            Phát triển ứng dụng web với giao diện
                                            responsive cho hệ thống vận hành.
                                            Xây dựng dashboard, báo cáo và KPI
                                            phục vụ quản lý. Thiết kế data table
                                            hỗ trợ filter, sort, pagination.
                                            Tham gia thiết kế database schema,
                                            xây dựng API và business logic.
                                            Xử lý dữ liệu phía backend và trả
                                            kết quả cho frontend. Tối ưu hiệu
                                            suất truy vấn và xử lý dữ liệu nhằm
                                            đảm bảo hệ thống hoạt động ổn định
                                            và hiệu quả.
                                        </p>
                                    </div>
                                </section>

                                {/* REQUIREMENTS */}
                                <section className="job-details-section">
                                    <h2>Yêu cầu</h2>

                                    <div className="section-text">
                                        <p>
                                            Có kinh nghiệm phát triển web với
                                            JavaScript/ TypeScript, ưu tiên
                                            React. Hiểu và làm việc được với
                                            REST API, database quan hệ.
                                            Sử dụng Git tốt, có tư duy logic
                                            và khả năng xử lý vấn đề. Biết làm
                                            UI, gọi API và hiểu responsive.
                                        </p>
                                    </div>
                                </section>

                                {/* BENEFITS */}
                                <section className="job-details-section">
                                    <h2>Quyền lợi</h2>

                                    <div className="section-text">
                                        <p>
                                            Mức lương cạnh tranh theo năng lực.
                                            Review lương 2 lần/năm. Thưởng Lễ,
                                            Tết, sinh nhật và nhiều chế độ
                                            phúc lợi khác. Tham gia đầy đủ
                                            BHXH/BHYT theo quy định của luật
                                            lao động. Du lịch và team building
                                            ít nhất 2 lần/năm. Có cơ hội thăng
                                            tiến và phát triển sự nghiệp lâu dài.
                                        </p>
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT */}
                            <div className="sidebar-column">

                                {/* JOB DETAIL */}
                                <div className="info-card purple-card">
                                    <h3>CHI TIẾT CÔNG VIỆC</h3>

                                    <div className="detail-item">
                                        <span className="material-symbols-outlined">
                                            schedule
                                        </span>

                                        <p>
                                            Hình thức làm việc : Full time
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <span className="material-symbols-outlined">
                                            calendar_month
                                        </span>

                                        <p>
                                            Hạn chót ứng tuyển : 30/4/2026
                                        </p>
                                    </div>
                                </div>

                                {/* RECRUITER */}
                                <div className="info-card purple-card">
                                    <h3>
                                        THÔNG TIN NGƯỜI TUYỂN DỤNG
                                    </h3>

                                    <div className="detail-item">
                                        <span className="material-symbols-outlined">
                                            person
                                        </span>

                                        <p>
                                            Nguyễn Thị Lan Anh
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <span className="material-symbols-outlined">
                                            phone
                                        </span>

                                        <p>
                                            0876546786
                                        </p>
                                    </div>

                                    <div className="detail-item">
                                        <span className="material-symbols-outlined">
                                            email
                                        </span>

                                        <p>
                                            lanhanh@gmail.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="list-jobs">
                    <h2 className="list-jobs-title">
                        Công việc liên quan
                    </h2>

                    <div className="related-jobs-list">
                        {relatedJobs.map((job) => (
                            <Component_job
                                key={job.id}
                                title={job.title}
                                logo={job.logo}
                                company_name={job.company_name}
                                location={job.location}
                                salary={job.salary}
                            />
                        ))}
                    </div>
                </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Job_Details;