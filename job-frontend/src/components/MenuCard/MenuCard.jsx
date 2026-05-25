import { useEffect, useState } from "react";
import styles from "../Sidebar/Sidebar.module.css";
import {
  User,
  Briefcase,
  Bell,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRecruiterConditions } from "../../service/recruiter/check_condition";
import {
  getNotificationsApi,
  getTodayNewNotificationsCount,
  normalizeNotifications,
} from "../../service/notification/notification";

export default function Sidebar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [checkingPostConditions, setCheckingPostConditions] = useState(false);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const isProfileActive =
    location.pathname === "/recruiter-profile" ||
    location.pathname === "/change-password" ||
    location.pathname === "/company-profile" ||
    location.pathname === "/business-paper";

  const isManageRecruitmentActive =
    location.pathname === "/manage-recruitment" ||
    location.pathname.startsWith("/job-details/") ||
    location.pathname.startsWith("/job-applicants/") ||
    location.pathname.startsWith("/post-news/create-job/");

  const isPostNewsActive =
    location.pathname === "/post-news/create-job" ||
    location.pathname === "/post-news/conditions";

  const isNotificationActive = location.pathname === "/recruiter-notifications";
  const isDashboardActive = location.pathname === "/recruiter-dashboard";

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
      } catch {
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
  }, [location.pathname]);

  const handlePostNewsClick = async () => {
    if (checkingPostConditions) return;

    try {
      setCheckingPostConditions(true);

      const response = await getRecruiterConditions();
      const conditions = response.data || {};

      const canCreateJob =
        Boolean(conditions.isVerifyPhone) &&
        Boolean(conditions.hasCompanyInfo) &&
        Boolean(conditions.isCertificateApproved);

      navigate(
        canCreateJob ? "/post-news/create-job" : "/post-news/conditions"
      );
    } catch (error) {
      console.error("Lỗi kiểm tra điều kiện đăng tin:", error);
      navigate("/post-news/conditions");
    } finally {
      setCheckingPostConditions(false);
    }
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div>
        <div
          className={`${styles.item} ${isProfileActive ? styles.active : ""}`}
          onClick={() => {
            if (collapsed) {
              setCollapsed(false);
              setOpenProfile(true);
            } else {
              setOpenProfile((prev) => !prev);
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
                location.pathname === "/recruiter-profile"
                  ? styles.activeSub
                  : ""
              }`}
              onClick={() => navigate("/recruiter-profile")}
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
          </div>
        )}
      </div>

      <div
        className={`${styles.item} ${isDashboardActive ? styles.active : ""}`}
        onClick={() => navigate("/recruiter-dashboard")}
      >
        <LayoutDashboard size={20} />
        {!collapsed && <span>Dashboard</span>}
      </div>

      <div
        className={`${styles.item} ${
          isManageRecruitmentActive ? styles.active : ""
        }`}
        onClick={() => navigate("/manage-recruitment")}
      >
        <Briefcase size={20} />
        {!collapsed && <span>Quản lý tuyển dụng</span>}
      </div>

      <div
        className={`${styles.item} ${isPostNewsActive ? styles.active : ""}`}
        onClick={handlePostNewsClick}
      >
        <PlusCircle size={20} />
        {!collapsed && (
          <span>
            {checkingPostConditions ? "Đang kiểm tra..." : "Đăng tin tuyển dụng"}
          </span>
        )}
      </div>

      <div
        className={`${styles.item} ${
          isNotificationActive ? styles.active : ""
        }`}
        onClick={() => navigate("/recruiter-notifications")}
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
