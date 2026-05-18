import { Check, Eye, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./UserTable.module.css";

const ALL_LABEL = "Tất cả";
const ACTIVE_LABEL = "Đang hoạt động";
const LOCKED_LABEL = "Đã khóa";

const roleLabels = {
  candidate: "Ứng viên",
  recruiter: "Nhà tuyển dụng",
  admin: "Admin",
};

const isLockedStatus = (status) => {
  return status === false || status === 0 || status === "false";
};

const getStatusLabel = (status) => {
  return isLockedStatus(status) ? LOCKED_LABEL : ACTIVE_LABEL;
};

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN").format(date);
};

const getInitial = (name, email) => {
  const value = name || email || "?";
  return value.trim().charAt(0).toUpperCase();
};

export default function UserTable({
  users = [],
  loading = false,
  actionLoadingId = null,
  statusFilter = ALL_LABEL,
  roleFilter = ALL_LABEL,
  searchName = "",
  onToggleAccountStatus,
}) {
  const navigate = useNavigate();
  const normalizedSearch = searchName.trim().toLowerCase();

  const normalizedUsers = users
    .filter((user) => user.role !== "admin")
    .map((user) => {
      const name = user.full_name || user.fullName || user.name || "Chưa cập nhật";
      const role = roleLabels[user.role] || user.role || "Chưa cập nhật";
      const status = getStatusLabel(user.status);

      return {
        id: user.id,
        profileId: user.profile_id || user.profileId,
        name,
        email: user.email || "Chưa cập nhật",
        role,
        rawRole: user.role,
        rawStatus: user.status,
        status,
        date: formatDate(user.created_at || user.createdAt),
      };
    });

  const filteredUsers = normalizedUsers.filter((user) => {
    const matchStatus = statusFilter === ALL_LABEL || user.status === statusFilter;
    const matchRole = roleFilter === ALL_LABEL || user.role === roleFilter;
    const matchName =
      !normalizedSearch ||
      `${user.name} ${user.email}`.toLowerCase().includes(normalizedSearch);

    return matchStatus && matchRole && matchName;
  });

  const handleView = (user) => {
    const profileId = user.profileId || user.id;
    const path =
      user.rawRole === "candidate"
        ? `/candidate-profile/${profileId}`
        : `/recruiter-profile/${profileId}`;

    navigate(path, {
      state: {
        account: user,
      },
    });
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className={styles.empty}>
                Đang tải danh sách tài khoản...
              </td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5" className={styles.empty}>
                Không tìm thấy tài khoản phù hợp
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => {
              const isActive = user.status === ACTIVE_LABEL;
              const isProcessing = actionLoadingId === user.id;

              return (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatarBorder}>
                        <span>{getInitial(user.name, user.email)}</span>
                      </div>

                      <div className={styles.userText}>
                        <span>{user.name}</span>
                        <small>{user.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>{user.role}</td>

                  <td>
                    <span
                      className={`${styles.status} ${
                        isActive ? styles.active : styles.locked
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>{user.date}</td>

                  <td>
                    <div className={styles.actions}>
                      <button type="button" onClick={() => handleView(user)}>
                        <Eye size={18} />
                        Xem
                      </button>

                      <button
                        type="button"
                        className={isActive ? styles.lockAction : styles.unlockAction}
                        disabled={isProcessing}
                        onClick={() =>
                          onToggleAccountStatus?.({
                            id: user.id,
                            status: user.rawStatus,
                          })
                        }
                      >
                        {isActive ? (
                          <>
                            <UserX size={18} />
                            {isProcessing ? "Đang khóa..." : "Khóa"}
                          </>
                        ) : (
                          <>
                            <Check size={18} />
                            {isProcessing ? "Đang mở..." : "Mở khóa"}
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
