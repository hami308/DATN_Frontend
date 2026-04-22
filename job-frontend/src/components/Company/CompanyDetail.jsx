import { useEffect, useState } from "react";
import styles from "./CompanyDetail.module.css";

export default function CompanyDetail() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    // FAKE API
    setTimeout(() => {
      setCompany(fakeCompany);
    }, 300);
  }, []);

  if (!company) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <img src={company.logo} alt="logo" />
          </div>

          <div>
            <h2 className={styles.name}>{company.name}</h2>
            <p className={styles.tax}>Mã số thuế : {company.taxCode}</p>
          </div>
        </div>

        <p className={styles.desc}>{company.description}</p>

        <div className={styles.tags}>
          {company.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <div className={styles.contactCard}>
          <h3>Thông tin liên hệ</h3>

          <div className={styles.row}>
            <span>Link website</span>
            <span>{company.contact.website}</span>
          </div>

          <div className={styles.row}>
            <span>Link facebook</span>
            <span>{company.contact.facebook}</span>
          </div>

          <div className={styles.row}>
            <span>Địa điểm</span>
            <span>{company.contact.location}</span>
          </div>

          <div className={styles.row}>
            <span>Số điện thoại</span>
            <span>{company.contact.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* FAKE DATA */
const fakeCompany = {
  name: "Công ty FPT",
  taxCode: "2423354654",

  description:
    "FPT Corporation là một trong những tập đoàn công nghệ hàng đầu tại Việt Nam, hoạt động trong các lĩnh vực công nghệ thông tin, viễn thông và giáo dục. Với môi trường làm việc năng động, sáng tạo và nhiều cơ hội phát triển, FPT luôn thu hút nhân tài trong và ngoài nước.",

  tags: ["Giáo dục", "Công nghệ", "AI"],
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbLXeSuHzUZjF3AoyG1M6_TCKx8DfIkA-bng&s",
  contact: {
    website: "https://fpt.com.vn",
    facebook: "https://facebook.com/fpt",
    location: "Đà Nẵng",
    phone: "0769768428",
  },

  shareLink: "https://topcv.vn/cong-ty/fpt",
};
