import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./JobLineChart.module.css";

export function JobLineChart() {
  const [year, setYear] = useState(2026);

  const dataByYear = {
    2024: [
      { month: "T1", jobs: 120 },
      { month: "T2", jobs: 200 },
      { month: "T3", jobs: 250 },
      { month: "T4", jobs: 300 },
    ],
    2025: [
      { month: "T1", jobs: 80 },
      { month: "T2", jobs: 180 },
      { month: "T3", jobs: 220 },
      { month: "T4", jobs: 260 },
    ],
    2026: [
      { month: "T1", jobs: 100 },
      { month: "T2", jobs: 300 },
      { month: "T3", jobs: 500 },
      { month: "T4", jobs: 400 },
    ],
  };

  return (
    <div className={styles.card}>
      {/* HEADER */}

      {/* FILTER */}
      <div className={styles.filter}>
        <span>Năm</span>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className={styles.select}
        >
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>

      {/* CHART */}
      <div className={styles.chartBox}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dataByYear[year]}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="jobs"
              stroke="#c4a7e7"
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
