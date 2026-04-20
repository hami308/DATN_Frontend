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

export default function Sidebar() {
  const [active, setActive] = useState("home");
  const [openProfile, setOpenProfile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div
        className={`${styles.item} ${active === "home" ? styles.active : ""}`}
        onClick={() => setActive("home")}
      >
        <Home size={20} />
        {!collapsed && <span>Trang chủ</span>}
      </div>
      <div>
        <div
          className={`${styles.item} ${
            active.startsWith("profile") ? styles.active : ""
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

        {openProfile && !collapsed && (
          <div className={styles.subMenu}>
            <div
              className={`${styles.subItem} ${
                active === "profile-info" ? styles.activeSub : ""
              }`}
              onClick={() => setActive("profile-info")}
            >
              Thông tin cá nhân
            </div>

            <div
              className={`${styles.subItem} ${
                active === "profile-pass" ? styles.activeSub : ""
              }`}
              onClick={() => setActive("profile-pass")}
            >
              Đổi mật khẩu
            </div>
          </div>
        )}
      </div>

      <div
        className={`${styles.item} ${active === "cv" ? styles.active : ""}`}
        onClick={() => setActive("cv")}
      >
        <FileText size={20} />
        {!collapsed && <span>Quản lý CV</span>}
      </div>

      <div
        className={`${styles.item} ${active === "job" ? styles.active : ""}`}
        onClick={() => setActive("job")}
      >
        <Briefcase size={20} />
        {!collapsed && <span>Quản lý việc làm</span>}
      </div>

      <div
        className={`${styles.item} ${active === "noti" ? styles.active : ""}`}
        onClick={() => setActive("noti")}
      >
        <Bell size={20} />
        {!collapsed && <span>Thông báo</span>}
      </div>

      <div className={styles.item}>
        <LogOut size={20} />
        {!collapsed && <span>Đăng xuất</span>}
      </div>
    </div>
  );
}
