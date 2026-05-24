import { useEffect, useState } from "react";
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
import {
  getNotificationsApi,
  getTodayNewNotificationsCount,
  normalizeNotifications,
} from "../../service/notification/notification";

export default function Sidebar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openJob, setOpenJob] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  const getActiveKeyFromPath = (pathname) => {
    if (pathname === "/home-candidate") return "home";

    if (
      pathname === "/candidate-profile" ||
      pathname === "/candidate-change-password"
    ) {
      return "profile";
    }

    if (pathname === "/cv-management") return "cv";

    if (
      pathname === "/saved-jobs" ||
      pathname === "/applied-jobs" ||
      pathname === "/candidate-job-recommend"
    ) {
      return "jobs";
    }

    if (pathname === "/candidate-notifications") return "notifications";

    return sessionStorage.getItem("candidateSidebarActive") || "home";
  };

  const activeKey = getActiveKeyFromPath(path);

  useEffect(() => {
    if (
      path === "/home-candidate" ||
      path === "/candidate-profile" ||
      path === "/candidate-change-password" ||
      path === "/cv-management" ||
      path === "/saved-jobs" ||
      path === "/applied-jobs" ||
      path === "/candidate-job-recommend" ||
      path === "/candidate-notifications"
    ) {
      sessionStorage.setItem("candidateSidebarActive", activeKey);
    }
  }, [path, activeKey]);

  const goTo = (url, key) => {
    sessionStorage.setItem("candidateSidebarActive", key);
    navigate(url);
  };

  const isHomeActive = activeKey === "home";
  const isProfileActive = activeKey === "profile";
  const isCVActive = activeKey === "cv";
  const isJobActive = activeKey === "jobs";
  const isNotificationActive = activeKey === "notifications";

  useEffect(() => {
    let isMounted = true;

    const fetchNewNotificationsCount = async () => {
      try {
        const response = await getNotificationsApi();
        const notifications = normalizeNotifications(response);
        const count = getTodayNewNotificationsCount(notifications);

        if (isMounted) {
          setNewNotificationsCount(count);
        }
      } catch (error) {
        if (isMounted) {
          setNewNotificationsCount(0);
        }
      }
    };

    fetchNewNotificationsCount();
    window.addEventListener("notifications-updated", fetchNewNotificationsCount);

    return () => {
      isMounted = false;
      window.removeEventListener(
        "notifications-updated",
        fetchNewNotificationsCount
      );
    };
  }, [path]);

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div
        className={`${styles.item} ${isHomeActive ? styles.active : ""}`}
        onClick={() => goTo("/home-candidate", "home")}
      >
        <Home size={20} />
        {!collapsed && <span>Trang chủ</span>}
      </div>

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
                path === "/candidate-profile" ? styles.activeSub : ""
              }`}
              onClick={() => goTo("/candidate-profile", "profile")}
            >
              Thông tin cá nhân
            </div>

            <div
              className={`${styles.subItem} ${
                path === "/candidate-change-password" ? styles.activeSub : ""
              }`}
              onClick={() => goTo("/candidate-change-password", "profile")}
            >
              Đổi mật khẩu
            </div>
          </div>
        )}
      </div>

      <div
        className={`${styles.item} ${isCVActive ? styles.active : ""}`}
        onClick={() => goTo("/cv-management", "cv")}
      >
        <FileText size={20} />
        {!collapsed && <span>Quản lý CV</span>}
      </div>

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
                path === "/saved-jobs" ? styles.activeSub : ""
              }`}
              onClick={() => goTo("/saved-jobs", "jobs")}
            >
              Việc làm đã lưu
            </div>

            <div
              className={`${styles.subItem} ${
                path === "/applied-jobs" ? styles.activeSub : ""
              }`}
              onClick={() => goTo("/applied-jobs", "jobs")}
            >
              Việc làm đã ứng tuyển
            </div>
          </div>
        )}
      </div>

      <div
        className={`${styles.item} ${
          isNotificationActive ? styles.active : ""
        }`}
        onClick={() => goTo("/candidate-notifications", "notifications")}
      >
        <Bell size={20} />
        {!collapsed && (
          <span className={styles.itemLabel}>
            <span>Thông báo</span>
            {newNotificationsCount > 0 && (
              <span className={styles.notificationBadge}>
                {newNotificationsCount > 99 ? "99+" : newNotificationsCount}
              </span>
            )}
          </span>
        )}
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
