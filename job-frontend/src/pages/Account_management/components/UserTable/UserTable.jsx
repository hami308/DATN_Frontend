import { Eye, Check, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./UserTable.module.css";

const roleLabels = {
  candidate: "Ứng viên",
  recruiter: "Nhà tuyển dụng",
  admin: "Admin",
};

const getStatusLabel = (status) => {
  if (status === false || status === 0 || status === "false") {
    return "Đã khóa";
  }

  return "Đang hoạt động";
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
  statusFilter,
  roleFilter,
  searchName,
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
        status,
        date: formatDate(user.created_at || user.createdAt),
      };
    });

  const filteredUsers = normalizedUsers.filter((user) => {
    const matchStatus =
      statusFilter === "Tất cả" || user.status === statusFilter;

    const matchRole = roleFilter === "Tất cả" || user.role === roleFilter;

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
            filteredUsers.map((user) => (
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
                      user.status === "Đang hoạt động"
                        ? styles.active
                        : styles.locked
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

                    <button type="button">
                      <Check size={18} />
                      Mở khóa
                    </button>

                    <button type="button">
                      <UserX size={18} />
                      Khóa
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
