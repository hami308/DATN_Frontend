import { useEffect, useState } from "react";
import { JobLineChart } from "../Chart/LineChart";
import { TopIndustryChart } from "../Chart/BarChart";
import { TopLocationCard } from "../Card/TopLocationCard";
import { TopCompanyCard } from "../Card/TopCompanyCard";
import { getAdminDashboardApi } from "../../../../service/admin/admin_dashboard";
import styles from "./Dashboard.module.css";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  return (
    error?.message ||
    error?.data?.message ||
    error?.error ||
    "Không thể tải dữ liệu dashboard."
  );
};

export default function Dashboard() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminDashboardApi(year);

        if (isMounted) {
          setDashboard(response?.data || null);
        }
      } catch (error) {
        if (isMounted) {
          setError(getErrorMessage(error));
          setDashboard(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, [year]);

  const summary = dashboard?.summary || {};
  const total = summary.totalJobs || 0;
  const years = dashboard?.years?.length
    ? dashboard.years
    : [summary.year || year];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Hi Admin</h3>
        <h2>
          Có {total} công việc trong năm {year}
        </h2>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.state}>Đang tải dữ liệu dashboard...</div>}

      <div className={`${styles.row} ${loading ? styles.isLoading : ""}`}>
        <div className={`${styles.card} ${styles.large}`}>
          <h4>Tổng số bài đăng tuyển theo tháng</h4>
          <JobLineChart
            data={dashboard?.jobsByMonth || []}
            year={year}
            years={years}
            onYearChange={setYear}
          />
        </div>

        <div className={`${styles.card} ${styles.small}`}>
          <h4>10 ngành có tỉ lệ tuyển dụng cao nhất</h4>
          <TopIndustryChart data={dashboard?.topIndustries || []} />
        </div>
      </div>

      <div className={`${styles.row} ${styles.mt20} ${loading ? styles.isLoading : ""}`}>
        <div className={styles.card}>
          <h4>Địa điểm có tỉ lệ tuyển dụng cao nhất</h4>
          <TopLocationCard data={dashboard?.topLocations || []} />
        </div>

        <div className={styles.card}>
          <h4>Công ty có tỉ lệ tuyển dụng cao nhất</h4>
          <TopCompanyCard data={dashboard?.topCompanies || []} />
        </div>
      </div>
    </div>
  );
}
