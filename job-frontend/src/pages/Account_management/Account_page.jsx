import { useState } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar_admin/Sidebar";

import Combobox from "../../components/Combobox/Combobox";
import UserTable from "./components/UserTable/UserTable";

import styles from "./AccountPage.module.css";

export default function Account_page() {
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const [roleFilter, setRoleFilter] = useState("Tất cả");

  const [searchName, setSearchName] = useState("");

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.body}>
        {/* Sidebar tự giữ css riêng */}
        <Sidebar />

        {/* Content */}
        <main className={styles.content}>
          <h2 className={styles.title}>Quản lý tài khoản</h2>

          <div className={styles.filterRow}>
            <Combobox
              options={["Tất cả", "Đang hoạt động", "Đã khóa"]}
              defaultValue="Lọc trạng thái"
              onSelect={setStatusFilter}
            />

            <Combobox
              options={["Tất cả", "Ứng viên", "Nhà tuyển dụng", "Admin"]}
              defaultValue="Lọc vai trò"
              onSelect={setRoleFilter}
            />

            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>

          {/* Table tự giữ css riêng */}
          <UserTable
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            searchName={searchName}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}
