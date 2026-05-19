import { useState } from "react";
import styles from "./Sidebar.module.css";
import {
  Home,
  User,
  FileText,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardActive = location.pathname === "/admin-dashboard";

  const isAccountManagementActive =
    location.pathname === "/admin-account-management" ||
    location.pathname.startsWith("/admin-account-management/") ||
    location.pathname.startsWith("/recruiter-profile/");

  const isCompanyVerificationActive =
    location.pathname === "/admin-company-verification" ||
    location.pathname.startsWith("/admin-company-verification/");

  const isCompanyManagementActive =
    location.pathname === "/admin-company-management" ||
    location.pathname.startsWith("/admin-company-management/");
    location.pathname.startsWith("/company-detail/");

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div
        className={`${styles.item} ${
          isDashboardActive ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-dashboard")}
      >
        <Home size={20} />
        {!collapsed && <span>Dashboard</span>}
      </div>

      <div
        className={`${styles.item} ${
          isAccountManagementActive ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-account-management")}
      >
        <User size={20} />
        {!collapsed && <span>Quản lý tài khoản</span>}
      </div>

      <div
        className={`${styles.item} ${
          isCompanyManagementActive ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-company-management")}
      >
        <Building2 size={20} />
        {!collapsed && <span>Quản lý công ty</span>}
      </div>

      <div
        className={`${styles.item} ${
          isCompanyVerificationActive ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-company-verification")}
      >
        <FileText size={20} />
        {!collapsed && <span>Xác nhận giấy tờ</span>}
      </div>

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