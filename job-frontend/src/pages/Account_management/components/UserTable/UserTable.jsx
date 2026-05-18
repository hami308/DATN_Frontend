import React from "react";
import { Eye, Check, UserX } from "lucide-react";

import styles from "./UserTable.module.css";
import catImg from "../../../../assets/image/cat.png";
const users = [
  {
    id: 1,
    name: "Nguyễn Hà My",
    role: "Ứng viên",
    status: "Đang hoạt động",
    date: "1/3/2026",
    avatar: catImg,
  },
  {
    id: 2,
    name: "Nguyễn Hà My",
    role: "Ứng viên",
    status: "Đã khóa",
    date: "1/3/2026",
    avatar: catImg,
  },
  {
    id: 3,
    name: "Trần Văn Nam",
    role: "Nhà tuyển dụng",
    status: "Đang hoạt động",
    date: "1/3/2026",
    avatar: catImg,
  },
  {
    id: 4,
    name: "Lê Minh Anh",
    role: "Admin",
    status: "Đã khóa",
    date: "1/3/2026",
    avatar: catImg,
  },
];

export default function UserTable({ statusFilter, roleFilter, searchName }) {
  const filteredUsers = users.filter((user) => {
    const matchStatus =
      statusFilter === "Tất cả" || user.status === statusFilter;

    const matchRole = roleFilter === "Tất cả" || user.role === roleFilter;

    const matchName = user.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    return matchStatus && matchRole && matchName;
  });

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
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <div className={styles.userInfo}>
                  <div className={styles.avatarBorder}>
                    <img src={user.avatar} alt={user.name} />
                  </div>

                  <span>{user.name}</span>
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
                  <button type="button">
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
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5" className={styles.empty}>
                Không tìm thấy tài khoản phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
