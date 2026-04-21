import { useState } from "react";
import styles from "../Sidebar/Sidebar.module.css";
import {
  User,
  Briefcase,
  Bell,
  LogOut,
  PlusCircle,
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
      {/* Toggle Button */}
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Trang cá nhân */}
      <div>
        <div
          className={`${styles.item} ${
            location.pathname === "/recuiter-profile" ||
            location.pathname === "/change-password" ||
            location.pathname === "/company-profile" ||
            location.pathname === "/business-paper"
              ? styles.active
              : ""
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

        {(openProfile ||
          location.pathname === "/recuiter-profile" ||
          location.pathname === "/change-password" ||
          location.pathname === "/company-profile" ||
          location.pathname === "/business-paper") &&
          !collapsed && (
            <div className={styles.subMenu}>
              <div
                className={`${styles.subItem} ${
                  location.pathname === "/recuiter-profile"
                    ? styles.activeSub
                    : ""
                }`}
                onClick={() => navigate("/recuiter-profile")}
              >
                Thông tin cá nhân
              </div>

              <div
                className={`${styles.subItem} ${
                  location.pathname === "/change-password"
                    ? styles.activeSub
                    : ""
                }`}
                onClick={() => navigate("/change-password")}
              >
                Đổi mật khẩu
              </div>

              <div
                className={`${styles.subItem} ${
                  location.pathname === "/company-profile"
                    ? styles.activeSub
                    : ""
                }`}
                onClick={() => navigate("/company-profile")}
              >
                Thông tin công ty
              </div>

              <div
                className={`${styles.subItem} ${
                  location.pathname === "/business-paper"
                    ? styles.activeSub
                    : ""
                }`}
                onClick={() => navigate("/business-paper")}
              >
                Giấy đăng ký doanh nghiệp
              </div>
            </div>
          )}
      </div>

      {/* Quản lý tuyển dụng */}
      <div
        className={`${styles.item} ${
          location.pathname === "/manage-recruitment" ||
          location.pathname === "/manage-recruitment"
            ? styles.active
            : ""
        }`}
        onClick={() => navigate("/manage-recruitment")}
      >
        <Briefcase size={20} />
        {!collapsed && <span>Quản lý tuyển dụng</span>}
      </div>

      {/* Đăng tin tuyển dụng */}
      <div
        className={`${styles.item} ${
          location.pathname === "/post-news/create-job" ? styles.active : ""
        }`}
        onClick={() => navigate("/post-news/create-job")}
      >
        <PlusCircle size={20} />
        {!collapsed && <span>Đăng tin tuyển dụng</span>}
      </div>

      {/* Thông báo */}
      <div
        className={`${styles.item} ${
          location.pathname === "/company-notification"
            ? styles.active
            : ""
        }`}
        onClick={() => navigate("/company-notification")}
      >
        <Bell size={20} />
        {!collapsed && <span>Thông báo</span>}
      </div>

      {/* Đăng xuất */}
      <div className={styles.item}>
        <LogOut size={20} />
        {!collapsed && <span>Đăng xuất</span>}
      </div>
    </div>
  );
}