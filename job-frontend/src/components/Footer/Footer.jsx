import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Cột 1 - Logo + mô tả */}
        <div className="footer-col">
          <h2 className="footer-logo">MyCV</h2>
          <p>
            Nền tảng kết nối nhà tuyển dụng và ứng viên thông minh,
            giúp bạn tìm việc nhanh chóng và hiệu quả.
          </p>
        </div>

        {/* Cột 2 - Ứng viên */}
        <div className="footer-col">
          <h3>Ứng viên</h3>
          <ul>
            <li>Tìm việc làm</li>
            <li>Tạo CV</li>
            <li>Việc làm phù hợp</li>
            <li>Công ty nổi bật</li>
          </ul>
        </div>

        {/* Cột 3 - Nhà tuyển dụng */}
        <div className="footer-col">
          <h3>Nhà tuyển dụng</h3>
          <ul>
            <li>Đăng tuyển dụng</li>
            <li>Tìm ứng viên</li>
            <li>Quản lý tin đăng</li>
            <li>Giải pháp tuyển dụng</li>
          </ul>
        </div>

        {/* Cột 4 - Liên hệ */}
        <div className="footer-col">
          <h3>Liên hệ</h3>
          <ul>
            <li>Email: support@mycvflow.com</li>
            <li>Hotline: 0123 456 789</li>
            <li>Địa chỉ: Việt Nam</li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 MyCVFlow. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;