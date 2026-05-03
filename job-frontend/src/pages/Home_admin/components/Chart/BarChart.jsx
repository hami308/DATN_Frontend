import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function TopIndustryChart() {
  const data = [
    { name: "IT", jobs: 500 },
    { name: "Marketing", jobs: 420 },
    { name: "Giáo dục", jobs: 380 },
    { name: "Y tế", jobs: 350 },
    { name: "Tài chính", jobs: 300 },
    { name: "Logistics", jobs: 260 },
    { name: "Xây dựng", jobs: 220 },
    { name: "Sales", jobs: 200 },
    { name: "HR", jobs: 180 },
    { name: "Thiết kế", jobs: 150 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="jobs" fill="#c4a7e7" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
