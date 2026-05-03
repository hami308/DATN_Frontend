export function TopCompanyCard() {
  const data = [
    { name: "FPT Software", jobs: 300 },
    { name: "VNG", jobs: 250 },
    { name: "Viettel", jobs: 200 },
  ];

  return (
    <div>
      {data.map((item, i) => (
        <div
          key={i}
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
