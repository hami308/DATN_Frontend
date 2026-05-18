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

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* Collapse button */}
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Dashboard */}
      <div
        className={`${styles.item} ${
          location.pathname === "/admin-dashboard" ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-dashboard")}
      >
        <Home size={20} />
        {!collapsed && <span>Dashboard</span>}
      </div>

      {/* Quản lý tài khoản */}
      <div
        className={`${styles.item} ${
          location.pathname === "/admin-account-management" ? styles.active : ""
        }`}
        onClick={() => navigate("/admin-account-management")}
      >
        <User size={20} />
        {!collapsed && <span>Quản lý tài khoản</span>}
      </div>

      {/* Xác nhận công ty */}
      <div
        className={`${styles.item} ${
          location.pathname === "/admin-company-verification"
            ? styles.active
            : ""
        }`}
        onClick={() => navigate("/admin-company-verification")}
      >
        <FileText size={20} />
        {!collapsed && <span>Xác nhận giấy tờ</span>}
      </div>

      {/* Quản lý tin tuyển dụng */}
      <div
        className={`${styles.item} ${
          location.pathname === "/admin-job-management" ? styles.active : ""
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
