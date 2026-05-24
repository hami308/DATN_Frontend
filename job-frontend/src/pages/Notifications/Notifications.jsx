import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  MailOpen,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import MenuCard from "../../components/MenuCard/MenuCard";
import styles from "./Notifications.module.css";

import {
  getNotificationsApi,
  markAllNotificationsAsReadApi,
} from "../../service/notification/notification";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
};

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.data?.message ||
    error?.message ||
    "Không thể tải danh sách thông báo."
  );
};

const normalizeNotifications = (response) => {
  const payload = response?.data?.data || response?.data || response;

  const notifications =
    payload?.notifications ||
    payload?.notification ||
    payload?.items ||
    payload?.rows ||
    payload;

  if (!Array.isArray(notifications)) return [];

  return notifications.map((item, index) => ({
    id: item.id ?? item.notification_id ?? item.notificationId ?? index,
    title: item.title || item.subject || "Thông báo",
    message: item.message || item.content || item.description || "",
    type: item.type || item.kind || "info",
    category: item.sender,
    createdAt: item.created_at || item.createdAt || item.time || item.date,
    isRead: Boolean(item.is_read ?? item.isRead ?? item.read),
  }));
};

const formatTime = (value) => {
  if (!value) return "Vừa xong";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Vừa xong";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getNotificationIcon = (type) => {
  const normalizedType = String(type).toLowerCase();

  if (normalizedType.includes("application")) return Briefcase;
  if (normalizedType.includes("company")) return Building2;
  if (normalizedType.includes("deadline")) return Clock;
  if (normalizedType.includes("profile")) return CheckCircle;

  return Bell;
};

const getIconStyle = (type) => {
  const normalizedType = String(type).toLowerCase();

  if (
    normalizedType.includes("profile") ||
    normalizedType.includes("company")
  ) {
    return styles.success;
  }

  if (normalizedType.includes("deadline")) return styles.warning;

  return styles.info;
};

export default function Notifications() {
  const user = getUser();
  const location = useLocation();

  const role =
    user?.role === "recruiter" ||
    location.pathname === "/recruiter-notifications"
      ? "recruiter"
      : "candidate";

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotificationsApi();
      const data = normalizeNotifications(response);

      setNotifications(data);
    } catch (error) {
      setError(getErrorMessage(error));
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [role]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const todayCount = notifications.filter((item) => {
    const createdDate = new Date(item.createdAt);
    const today = new Date();

    return (
      !Number.isNaN(createdDate.getTime()) &&
      createdDate.toDateString() === today.toDateString()
    );
  }).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((item) => !item.isRead);
    }

    return notifications;
  }, [filter, notifications]);

  const markAllAsRead = async () => {
    try {
      setMarkingAll(true);
      setLoading(true);
      setError("");

      await markAllNotificationsAsReadApi();
      await fetchNotifications();
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (error) {
      console.error("Không thể đánh dấu tất cả đã đọc:", error);
      setError(
        error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          "Không thể đánh dấu tất cả đã đọc."
      );
      setLoading(false);
    } finally {
      setMarkingAll(false);
    }
  };

  const pageTitle =
    role === "recruiter"
      ? "Thông báo nhà tuyển dụng"
      : "Thông báo ứng viên";

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        {role === "recruiter" ? <MenuCard /> : <Sidebar />}

        <div className={styles.content}>
          <section className={styles.panel}>
            <div className={styles.header}>
              <div className={styles.titleGroup}>
                <h1 className={styles.title}>{pageTitle}</h1>
                <p className={styles.subtitle}>
                  Theo dõi các cập nhật mới nhất từ hệ thống tuyển dụng.
                </p>
              </div>

              <button
                type="button"
                className={styles.markAllButton}
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || loading || markingAll}
              >
                <MailOpen size={18} />
                {markingAll
                  ? "Đang cập nhật..."
                  : "Đánh dấu tất cả đã đọc"}
              </button>
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>Tất cả</p>
                <p className={styles.summaryValue}>{notifications.length}</p>
              </div>

              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>Chưa đọc</p>
                <p className={styles.summaryValue}>{unreadCount}</p>
              </div>

              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>Hôm nay</p>
                <p className={styles.summaryValue}>{todayCount}</p>
              </div>
            </div>

            <div className={styles.toolbar}>
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={`${styles.tab} ${
                    filter === "all" ? styles.tabActive : ""
                  }`}
                  onClick={() => setFilter("all")}
                >
                  Tất cả
                </button>

                <button
                  type="button"
                  className={`${styles.tab} ${
                    filter === "unread" ? styles.tabActive : ""
                  }`}
                  onClick={() => setFilter("unread")}
                >
                  Chưa đọc
                </button>
              </div>
            </div>

            <div className={styles.list}>
              {loading && (
                <div className={styles.state}>Đang tải thông báo...</div>
              )}

              {!loading && error && (
                <div className={`${styles.state} ${styles.error}`}>
                  {error}
                </div>
              )}

              {!loading &&
                !error &&
                filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);

                  return (
                    <article
                      key={notification.id}
                      className={`${styles.notification} ${
                        !notification.isRead ? styles.unread : ""
                      }`}
                    >
                      <div
                        className={`${styles.iconWrap} ${getIconStyle(
                          notification.type
                        )}`}
                      >
                        <Icon size={22} />
                      </div>

                      <div className={styles.body}>
                        <h2 className={styles.notificationTitle}>
                          {notification.title}
                        </h2>

                        <p className={styles.message}>
                          {notification.message}
                        </p>

                        <div className={styles.meta}>
                          <span className={styles.badge}>
                            {notification.category}
                          </span>
                          <span>{formatTime(notification.createdAt)}</span>
                        </div>
                      </div>

                      <div className={styles.status}>
                        {!notification.isRead && <span className={styles.dot} />}
                      </div>
                    </article>
                  );
                })}

              {!loading && !error && filteredNotifications.length === 0 && (
                <div className={styles.state}>Không có thông báo phù hợp.</div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
