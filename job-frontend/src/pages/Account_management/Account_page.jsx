import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar_admin/Sidebar";
import Combobox from "../../components/Combobox/Combobox";
import UserTable from "./components/UserTable/UserTable";
import { getAdminAccountsApi } from "../../service/admin/admin_dashboard";
import styles from "./AccountPage.module.css";

export default function Account_page() {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [searchName, setSearchName] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminAccountsApi();
        const accountData =
          response?.data?.users ||
          response?.users ||
          response?.data ||
          [];

        if (isMounted) {
          setUsers(Array.isArray(accountData) ? accountData : []);
        }
      } catch (error) {
        if (isMounted) {
          setUsers([]);
          setError(
            error?.message ||
              error?.data?.message ||
              error?.error ||
              "Không thể tải danh sách tài khoản."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAccounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.body}>
        <Sidebar />

        <main className={styles.content}>
          <h2 className={styles.title}>Quản lý tài khoản</h2>

          <div className={styles.filterRow}>
            <Combobox
              options={["Tất cả", "Đang hoạt động", "Đã khóa"]}
              defaultValue="Tất cả"
              onSelect={setStatusFilter}
            />

            <Combobox
              options={["Tất cả", "Ứng viên", "Nhà tuyển dụng"]}
              defaultValue="Tất cả"
              onSelect={setRoleFilter}
            />

            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <UserTable
            users={users}
            loading={loading}
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
