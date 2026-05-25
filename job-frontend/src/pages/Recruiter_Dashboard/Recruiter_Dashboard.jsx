import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  Files,
} from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import MenuCard from "../../components/MenuCard/MenuCard";
import { getRecruiterStatisticsApi } from "../../service/recruiter/recruiter_statistics";
import styles from "./Recruiter_Dashboard.module.css";

const MONTHS = Array.from({ length: 12 }, (_, index) => ({
  value: index + 1,
  label: `Tháng ${index + 1}`,
  shortLabel: `T${index + 1}`,
}));

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  return (
    error?.message ||
    error?.data?.message ||
    error?.error ||
    "Không thể tải dữ liệu dashboard nhà tuyển dụng."
  );
};

const unwrapStatistics = (response) =>
  response?.data?.statistics || response?.statistics || response?.data || response || null;

const toNumber = (value) => {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : 0;
};

const getItemValue = (item, keys) => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null) {
      return item[key];
    }
  }

  return 0;
};

const getMetricValue = (value) => {
  if (value && typeof value === "object") {
    return toNumber(
      getItemValue(value, [
        "total",
        "count",
        "jobs",
        "postedJobs",
        "value",
        "cvPassed",
        "cv_passed_applications",
      ])
    );
  }

  return toNumber(value);
};

const normalizeMonthChartData = (byMonth) => {
  const monthMap = new Map();

  if (Array.isArray(byMonth)) {
    byMonth.forEach((item, index) => {
      const month = toNumber(
        getItemValue(item, ["month", "month_number", "monthNumber", "key"])
      ) || index + 1;
      const total = toNumber(
        getItemValue(item, ["total", "count", "jobs", "postedJobs", "value"])
      );

      monthMap.set(month, total);
    });
  } else if (byMonth && typeof byMonth === "object") {
    Object.entries(byMonth).forEach(([key, value]) => {
      monthMap.set(toNumber(key), getMetricValue(value));
    });
  }

  return MONTHS.map((month) => ({
    month: month.shortLabel,
    postedJobs: monthMap.get(month.value) || 0,
  }));
};

const normalizeYearChartData = (byYear) => {
  if (Array.isArray(byYear)) {
    return byYear
      .map((item) => ({
        year: String(getItemValue(item, ["year", "key"])),
        postedJobs: toNumber(
          getItemValue(item, ["total", "count", "jobs", "postedJobs", "value"])
        ),
      }))
      .filter((item) => item.year && item.year !== "0")
      .sort((a, b) => Number(a.year) - Number(b.year));
  }

  if (byYear && typeof byYear === "object") {
    return Object.entries(byYear)
      .map(([year, value]) => ({
        year,
        postedJobs: getMetricValue(value),
      }))
      .sort((a, b) => Number(a.year) - Number(b.year));
  }

  return [];
};

const normalizeApplicationsByJob = (applications = []) =>
  (Array.isArray(applications) ? applications : []).map((job) => ({
    id: job.job_id,
    name: job.job_name || "Tin tuyển dụng",
    status: job.job_status,
    createdAt: job.job_created_at,
    totalApplications: toNumber(job.total_applications),
    cvPassedApplications: toNumber(job.cv_passed_applications),
  }));

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";

  return new Intl.DateTimeFormat("vi-VN").format(date);
};

const formatJobStatus = (status) => {
  if (status === undefined || status === null || status === "") {
    return "Chưa cập nhật";
  }

  const normalized = String(status).toLowerCase();

  if (normalized === "1" || normalized === "active" || normalized === "open") {
    return "Đang mở";
  }

  if (normalized === "0" || normalized === "closed") {
    return "Đã đóng";
  }

  if (normalized === "2" || normalized === "expired") {
    return "Hết hạn";
  }

  return String(status);
};

const getRate = (part, total) => {
  if (!total) return 0;

  return Math.round((part / total) * 100);
};

function RecruiterDashboard() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState("");
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRecruiterStatisticsApi({ year, month });

        if (isMounted) {
          setStatistics(unwrapStatistics(response));
        }
      } catch (error) {
        if (isMounted) {
          setError(getErrorMessage(error));
          setStatistics(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStatistics();

    return () => {
      isMounted = false;
    };
  }, [year, month]);

  const postedJobs = statistics?.postedJobs || {};
  const applicationsByJob = useMemo(
    () => normalizeApplicationsByJob(statistics?.applicationsByJob),
    [statistics]
  );
  const monthChartData = useMemo(
    () => normalizeMonthChartData(postedJobs.byMonth),
    [postedJobs.byMonth]
  );
  const yearChartData = useMemo(
    () => normalizeYearChartData(postedJobs.byYear),
    [postedJobs.byYear]
  );

  const totalPostedJobs = toNumber(postedJobs.total);
  const totalApplications = applicationsByJob.reduce(
    (sum, job) => sum + job.totalApplications,
    0
  );
  const totalCvPassed =
    toNumber(statistics?.cvPassed?.total) ||
    applicationsByJob.reduce((sum, job) => sum + job.cvPassedApplications, 0);
  const cvPassedRate = getRate(totalCvPassed, totalApplications);
  const selectedMonthLabel = month
    ? MONTHS.find((item) => item.value === Number(month))?.label
    : "Tất cả tháng";
  const hasYearData = yearChartData.some((item) => item.postedJobs > 0);

  const resetFilters = () => {
    setYear(currentYear);
    setMonth("");
  };

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <MenuCard />

        <main className={styles.content}>
          <div className={styles.header}>
            <div className={styles.titleGroup}>
              <p className={styles.eyebrow}>Recruiter dashboard</p>
              <h1 className={styles.title}>Thống kê tuyển dụng</h1>
              <p className={styles.subtitle}>
                Theo dõi tin đã đăng, lượng ứng viên và số CV đã duyệt.
              </p>
            </div>

            <div className={styles.filters}>
              <div className={styles.field}>
                <label htmlFor="dashboard-year">Năm</label>
                <input
                  id="dashboard-year"
                  className={styles.input}
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="dashboard-month">Tháng</label>
                <select
                  id="dashboard-month"
                  className={styles.select}
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                >
                  <option value="">Tất cả</option>
                  {MONTHS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className={styles.clearButton}
                type="button"
                onClick={resetFilters}
              >
                Đặt lại
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {loading && (
            <div className={styles.message}>Đang tải dữ liệu dashboard...</div>
          )}

          <section className={`${styles.summaryGrid} ${loading ? styles.isLoading : ""}`}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryIcon}>
                <BriefcaseBusiness size={22} />
              </span>
              <div>
                <p className={styles.summaryLabel}>Tin đã đăng</p>
                <p className={styles.summaryValue}>{totalPostedJobs}</p>
                <p className={styles.summaryHint}>{year} - {selectedMonthLabel}</p>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <span className={styles.summaryIcon}>
                <Files size={22} />
              </span>
              <div>
                <p className={styles.summaryLabel}>Tổng hồ sơ</p>
                <p className={styles.summaryValue}>{totalApplications}</p>
                <p className={styles.summaryHint}>Từ các tin tuyển dụng</p>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <span className={styles.summaryIcon}>
                <FileCheck2 size={22} />
              </span>
              <div>
                <p className={styles.summaryLabel}>CV đã duyệt</p>
                <p className={styles.summaryValue}>{totalCvPassed}</p>
                <p className={styles.summaryHint}>
                  Trạng thái: {statistics?.passedCvStatus || "approved"}
                </p>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <span className={styles.summaryIcon}>
                <CheckCircle2 size={22} />
              </span>
              <div>
                <p className={styles.summaryLabel}>Tỷ lệ CV đạt</p>
                <p className={styles.summaryValue}>{cvPassedRate}%</p>
                <p className={styles.summaryHint}>CV đạt / tổng hồ sơ</p>
              </div>
            </div>
          </section>

          <section className={`${styles.grid} ${loading ? styles.isLoading : ""}`}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Tin tuyển dụng theo tháng</h2>
                <span className={styles.panelMeta}>Năm {year}</span>
              </div>

              <div className={styles.chartBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="postedJobs"
                      name="Tin đã đăng"
                      stroke="#0a2fb6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Tin tuyển dụng theo năm</h2>
              </div>

              {hasYearData ? (
                <div className={styles.chartBox}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="postedJobs"
                        name="Tin đã đăng"
                        fill="#0a2fb6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className={styles.empty}>Chưa có dữ liệu theo năm.</div>
              )}
            </div>
          </section>

          <section className={`${styles.panel} ${loading ? styles.isLoading : ""}`}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Chi tiết từng tin tuyển dụng</h2>
              <span className={styles.panelMeta}>{applicationsByJob.length} tin</span>
            </div>

            {applicationsByJob.length > 0 ? (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tin tuyển dụng</th>
                      <th>Trạng thái</th>
                      <th>Ngày đăng</th>
                      <th>Tổng hồ sơ</th>
                      <th>CV đã duyệt</th>
                      <th>Tỷ lệ đạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicationsByJob.map((job) => (
                      <tr key={job.id || job.name}>
                        <td className={styles.jobName}>{job.name}</td>
                        <td>
                          <span className={styles.status}>
                            {formatJobStatus(job.status)}
                          </span>
                        </td>
                        <td className={styles.muted}>{formatDate(job.createdAt)}</td>
                        <td>{job.totalApplications}</td>
                        <td>{job.cvPassedApplications}</td>
                        <td>
                          {getRate(job.cvPassedApplications, job.totalApplications)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.empty}>Chưa có tin tuyển dụng phù hợp.</div>
            )}
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default RecruiterDashboard;
