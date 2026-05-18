export function TopCompanyCard({ data = [] }) {
  if (data.length === 0) {
    return <div>Chưa có dữ liệu công ty.</div>;
  }

  return (
    <div>
      {data.map((item, index) => (
        <div
          key={`${item.company_id || item.name}-${index}`}
          style={{
            padding: 12,
            background: "#fff",
            borderRadius: 12,
            marginBottom: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontWeight: 600 }}>{item.name}</div>
          <div style={{ color: "#888" }}>{item.jobs} jobs</div>
        </div>
      ))}
    </div>
  );
}
