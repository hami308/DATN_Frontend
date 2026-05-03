import { JobLineChart } from "../Chart/LineChart";
import { TopIndustryChart } from "../Chart/BarChart";
import { TopLocationCard } from "../Card/TopLocationCard";
import { TopCompanyCard } from "../Card/TopCompanyCard";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const total = 120;
  const year = 2025;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <h3>👋 Hi Admin</h3>
        <h2>
          Có {total} công việc trong năm {year}
        </h2>
      </div>

      {/* ROW 1 */}
      <div className={styles.row}>
        <div className={`${styles.card} ${styles.large}`}>
          <h4>Tổng số bài đăng tuyển theo tháng</h4>
          <JobLineChart />
        </div>

        <div className={`${styles.card} ${styles.small}`}>
          <h4> 10 ngành có tỉ lệ tuyển dụng cao nhất</h4>
          <TopIndustryChart />
        </div>
      </div>

      {/* ROW 2 */}
      <div className={`${styles.row} ${styles.mt20}`}>
        <div className={styles.card}>
          <h4>Địa điểm có tỉ lệ tuyển dụng cao nhất </h4>
          <TopLocationCard />
        </div>

        <div className={styles.card}>
          <h4>Công ty có tỉ lệ tuyển dụng cao nhất </h4>
          <TopCompanyCard />
        </div>
      </div>
    </div>
  );
}
