import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  User,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin-dashboard",
    icon: Home,
    isActive: (pathname) =>
      pathname === "/admin-dashboard" || pathname === "/home-admin",
  },
  {
    label: "Quản lý tài khoản",
    path: "/admin-account-management",
    icon: User,
    isActive: (pathname) =>
      pathname === "/admin-account-management" ||
      pathname.startsWith("/admin-account-management/") ||
      pathname.startsWith("/recruiter-profile/") ||
      pathname.startsWith("/candidate-profile/"),
  },
  {
    label: "Quản lý công ty",
    path: "/admin-company-management",
    icon: Building2,
    isActive: (pathname) =>
      pathname === "/admin-company-management" ||
      pathname.startsWith("/admin-company-management/") ||
      pathname.startsWith("/company-detail/"),
  },
  {
    label: "Xác nhận giấy tờ",
    path: "/admin-company-verification",
    icon: FileText,
    isActive: (pathname) =>
      pathname === "/admin-company-verification" ||
      pathname.startsWith("/admin-company-verification/"),
  },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.header}>
        {!collapsed && (
          <div>
            <div className={styles.title}>Admin</div>
            <div className={styles.subtitle}>Quản trị hệ thống</div>
          </div>
        )}

        <button
          type="button"
          className={styles.collapseBtn}
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className={styles.nav} aria-label="Admin navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive(location.pathname);

          return (
            <button
              type="button"
              key={item.path}
              className={`${styles.item} ${active ? styles.active : ""}`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
            >
              <span className={styles.icon}>
                <Icon size={20} />
              </span>
              {!collapsed && <span className={styles.label}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button
          type="button"
          className={`${styles.item} ${styles.logout}`}
          onClick={handleLogout}
          title={collapsed ? "Đăng xuất" : undefined}
        >
          <span className={styles.icon}>
            <LogOut size={20} />
          </span>
          {!collapsed && <span className={styles.label}>Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
