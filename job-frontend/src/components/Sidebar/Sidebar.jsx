import { useState } from "react";
import styles from "./Sidebar.module.css";
import {
  Home,
  User,
  FileText,
  Briefcase,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openJob, setOpenJob] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isProfileActive = location.pathname.startsWith("/candidate");

  const isJobActive =
    location.pathname === "/saved-jobs" ||
    location.pathname === "/applied-jobs" ||
    location.pathname === "/candidate-job-recommend";

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Trang chủ */}
      <div
        className={`${styles.item} ${
          location.pathname === "/home-candidate" ? styles.active : ""
        }`}
        onClick={() => navigate("/home-candidate")}
      >
        <Home size={20} />
        {!collapsed && <span>Trang chủ</span>}
      </div>

      {/* Trang cá nhân */}
      <div>
        <div
          className={`${styles.item} ${isProfileActive ? styles.active : ""}`}
          onClick={() => setOpenProfile(!openProfile)}
        >
          <User size={20} />
          {!collapsed && (
            <>
              <span>Trang cá nhân</span>
              <ChevronDown
                size={16}
                className={`${styles.arrow} ${
                  openProfile || isProfileActive ? styles.rotate : ""
                }`}
              />
            </>
          )}
        </div>

        {(openProfile || isProfileActive) && !collapsed && (
          <div className={styles.subMenu}>
            <div
              className={`${styles.subItem} ${
                location.pathname === "/candidate-profile"
                  ? styles.activeSub
                  : ""
              }`}
              onClick={() => navigate("/candidate-profile")}
            >
              Thông tin cá nhân
            </div>

            <div
              className={`${styles.subItem} ${
                location.pathname === "/candidate-change-password"
                  ? styles.activeSub
                  : ""
              }`}
              onClick={() => navigate("/candidate-change-password")}
            >
              Đổi mật khẩu
            </div>
          </div>
        )}
      </div>

      {/* Quản lý CV */}
      <div
        className={`${styles.item} ${
          location.pathname === "/cv-management" ? styles.active : ""
        }`}
        onClick={() => navigate("/cv-management")}
      >
        <FileText size={20} />
        {!collapsed && <span>Quản lý CV</span>}
      </div>

      {/* Quản lý việc làm */}
      <div>
        <div
          className={`${styles.item} ${isJobActive ? styles.active : ""}`}
          onClick={() => setOpenJob(!openJob)}
        >
          <Briefcase size={20} />
          {!collapsed && (
            <>
              <span>Quản lý việc làm</span>
              <ChevronDown
                size={16}
                className={`${styles.arrow} ${
                  openJob || isJobActive ? styles.rotate : ""
                }`}
              />
            </>
          )}
        </div>

        {(openJob || isJobActive) && !collapsed && (
          <div className={styles.subMenu}>
            <div
              className={`${styles.subItem} ${
                location.pathname === "/saved-jobs" ? styles.activeSub : ""
              }`}
              onClick={() => navigate("/saved-jobs")}
            >
              Việc làm đã lưu
            </div>

            <div
              className={`${styles.subItem} ${
                location.pathname === "/applied-jobs" ? styles.activeSub : ""
              }`}
              onClick={() => navigate("/applied-jobs")}
            >
              Việc làm đã ứng tuyển
            </div>

            <div
              className={`${styles.subItem} ${
                location.pathname === "/candidate-job-recommend"
                  ? styles.activeSub
                  : ""
              }`}
              onClick={() => navigate("/candidate-job-recommend")}
            >
              Việc làm phù hợp với bạn
            </div>
          </div>
        )}
      </div>

      {/* Thông báo */}
      <div className={styles.item}>
        <Bell size={20} />
        {!collapsed && <span>Thông báo</span>}
      </div>

      {/* Logout */}
      <div
        className={styles.item}
        onClick={() => {
          localStorage.removeItem("token");
          sessionStorage.clear();
          navigate("/login");
        }}
      >
        <LogOut size={20} />
        {!collapsed && <span>Đăng xuất</span>}
      </div>
    </div>
  );
}
