import axiosClient from "../api";

export const getNotificationsApi = () => axiosClient.get("/notifications");

export const markNotificationAsReadApi = (notificationId) =>
  axiosClient.patch(`/notifications/${notificationId}/read`);

export const markAllNotificationsAsReadApi = () =>
  axiosClient.patch("/notifications/read-all");

export const normalizeNotifications = (response) => {
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
    createdAt: item.created_at || item.createdAt || item.time || item.date,
    isRead: Boolean(item.is_read ?? item.isRead ?? item.read),
  }));
};

export const getTodayNewNotificationsCount = (notifications) => {
  const today = new Date();

  return notifications.filter((item) => {
    const createdDate = new Date(item.createdAt);

    return (
      !item.isRead &&
      !Number.isNaN(createdDate.getTime()) &&
      createdDate.toDateString() === today.toDateString()
    );
  }).length;
};

export const getUnreadNotificationsCount = (notifications) =>
  notifications.filter((item) => !item.isRead).length;
