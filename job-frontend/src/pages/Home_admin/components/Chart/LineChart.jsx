import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./JobLineChart.module.css";

const DEFAULT_MONTHS = Array.from({ length: 12 }, (_, index) => ({
  month: `T${index + 1}`,
  jobs: 0,
}));

export function JobLineChart({ data = [], year, years = [], onYearChange }) {
  const chartData = data.length > 0 ? data : DEFAULT_MONTHS;
  const optionYears = years.length > 0 ? years : [year];

  return (
    <div className={styles.card}>
      <div className={styles.filter}>
        <span>Năm</span>

        <select
          value={year}
          onChange={(event) => onYearChange(Number(event.target.value))}
          className={styles.select}
        >
          {optionYears.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.chartBox}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="jobs"
              stroke="#372c7c"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
