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
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

      {/* Profile */}
      <div>
        <div
          className={`${styles.item} ${
            location.pathname.startsWith("/candidate") ? styles.active : ""
          }`}
          onClick={() => {
            if (collapsed) {
              setCollapsed(false);
              setOpenProfile(true);
            } else {
              setOpenProfile(!openProfile);
            }
          }}
        >
          <User size={20} />
          {!collapsed && (
            <>
              <span>Trang cá nhân</span>
              <ChevronDown
                size={16}
                className={`${styles.arrow} ${
                  openProfile ? styles.rotate : ""
                }`}
              />
            </>
          )}
        </div>

        {(openProfile || location.pathname.startsWith("/candidate")) &&
          !collapsed && (
            <div className={styles.subMenu}>
              {/* Thông tin cá nhân */}
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

              {/* Đổi mật khẩu */}
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

      {/* CV */}
      <div
        className={`${styles.item} ${
          location.pathname === "/candidate-cv" ? styles.active : ""
        }`}
      >
        <FileText size={20} />
        {!collapsed && <span>Quản lý CV</span>}
      </div>

      {/* Job */}
      <div
        className={`${styles.item} ${
          location.pathname === "/candidate-job" ? styles.active : ""
        }`}
      >
        <Briefcase size={20} />
        {!collapsed && <span>Quản lý việc làm</span>}
      </div>

      {/* Notification */}
      <div
        className={`${styles.item} ${
          location.pathname === "/candidate-noti" ? styles.active : ""
        }`}
      >
        <Bell size={20} />
        {!collapsed && <span>Thông báo</span>}
      </div>

      {/* Logout */}
      <div className={styles.item}>
        <LogOut size={20} />
        {!collapsed && <span>Đăng xuất</span>}
      </div>
    </div>
  );
}
