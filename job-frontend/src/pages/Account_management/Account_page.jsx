import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar_admin/Sidebar";
import Combobox from "../../components/Combobox/Combobox";
import UserTable from "./components/UserTable/UserTable";
import {
  getAdminAccountsApi,
  lockAdminAccountApi,
  unlockAdminAccountApi,
} from "../../service/admin/admin_dashboard";
import styles from "./AccountPage.module.css";

const isLockedStatus = (status) => {
  return status === false || status === 0 || status === "false";
};

export default function Account_page() {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [searchName, setSearchName] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminAccountsApi();
        const accountData =
          response?.data?.users || response?.users || response?.data || [];

        if (isMounted) {
          setUsers(Array.isArray(accountData) ? accountData : []);
        }
      } catch (error) {
        if (isMounted) {
          setUsers([]);
          setError(
            error?.response?.data?.message ||
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

  const handleToggleAccountStatus = async (user) => {
    const userId = user?.id;
    if (!userId) return;

    const shouldUnlock = isLockedStatus(user.status);

    try {
      setActionLoadingId(userId);
      setError("");

      const response = shouldUnlock
        ? await unlockAdminAccountApi(userId)
        : await lockAdminAccountApi(userId);

      const updatedUser = response?.data?.user || response?.user || {};
      const nextStatus =
        updatedUser.status !== undefined ? updatedUser.status : shouldUnlock;

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === userId
            ? {
                ...currentUser,
                ...updatedUser,
                status: nextStatus,
              }
            : currentUser
        )
      );
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể cập nhật trạng thái tài khoản."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

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
            actionLoadingId={actionLoadingId}
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            searchName={searchName}
            onToggleAccountStatus={handleToggleAccountStatus}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}
