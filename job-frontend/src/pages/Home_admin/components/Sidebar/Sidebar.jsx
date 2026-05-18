import { useState } from "react";
import styles from "./Sidebar.module.css";
import {
  Home,
  User,
  FileText,
  Briefcase,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Dashboard
  const isDashboardActive =
    location.pathname === "/admin-dashboard";

  // Quản lý tài khoản
  const isAccountManagementActive =
    location.pathname === "/admin-account-management" ||
    location.pathname.startsWith("/admin-account-management/");

  // Xác nhận công ty
  const isCompanyVerificationActive =
    location.pathname === "/admin-company-verification" ||
    location.pathname.startsWith("/admin-company-verification/");

  // Quản lý tuyển dụng
  const isJobManagementActive =
    location.pathname === "/admin-job-management" ||
    location.pathname.startsWith("/admin-job-management/") ||
    location.pathname.startsWith("/admin-job-details/") ||
    location.pathname.startsWith("/admin-job-applicants/") ||
    location.pathname.startsWith("/admin-job-edit/");

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* Collapse button */}
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Dashboard */}
      <div
        className={`${styles.item} ${
          isDashboardActive ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-dashboard")}
      >
        <Home size={20} />
        {!collapsed && <span>Dashboard</span>}
      </div>

      {/* Quản lý tài khoản */}
      <div
        className={`${styles.item} ${
          isAccountManagementActive ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-account-management")}
      >
        <User size={20} />
        {!collapsed && <span>Quản lý tài khoản</span>}
      </div>

      {/* Xác nhận giấy tờ */}
      <div
        className={`${styles.item} ${
          isCompanyVerificationActive ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-company-verification")}
      >
        <FileText size={20} />
        {!collapsed && <span>Xác nhận giấy tờ</span>}
      </div>

      {/* Quản lý tin tuyển dụng */}
      <div
        className={`${styles.item} ${
          isJobManagementActive ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-job-management")}
      >
        <Briefcase size={20} />
        {!collapsed && <span>Quản lý tin tuyển dụng</span>}
      </div>

      {/* Logout */}
      <div
        className={styles.item}
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
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