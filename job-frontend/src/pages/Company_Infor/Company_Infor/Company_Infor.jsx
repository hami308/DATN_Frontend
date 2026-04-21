import { useRef, useState } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import MenuCard from "../../../components/MenuCard/MenuCard";
import styles from "./Company_Infor.module.css";

export default function Company_Infor() {
  const fileRef = useRef();
  const [logo, setLogo] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogo(null);
    fileRef.current.value = "";
  };

  return (
    <div className={styles.company}>
      <Header />

      <main className={styles.companyMain}>
        <div className={styles.companyContainer}>
          <MenuCard />

          <div className={styles.companyContent}>
            <div className={styles.companyCard}>
              {/* Header */}
              <div className={styles.companyHeader}>
                <div className={styles.companyLogoWrapper}>
                  <div className={styles.companyLogo}>
                    {logo ? (
                      <img src={logo} alt="Company Logo" />
                    ) : (
                      <div className={styles.companyLogoPlaceholder} />
                    )}
                  </div>

                  <button
                    className={styles.companyUploadLogoBtn}
                    onClick={() => fileRef.current.click()}
                  >
                    <span className="material-symbols-outlined">upload</span>
                  </button>

                  {logo && (
                    <button
                      className={styles.companyRemoveLogoBtn}
                      onClick={removeLogo}
                    >
                      ✕
                    </button>
                  )}

                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={handleUpload}
                  />
                </div>

                <div className={styles.companyInfo}>
                  <h3>Công ty TNHH 2 Thành viên</h3>
                </div>
              </div>

              {/* Form */}
              <div className={styles.companyFormGroup}>
                <label>Mã số thuế</label>
                <input type="text" value="2423354654" readOnly />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Lĩnh vực hoạt động</label>
                <input type="text" value="Giáo dục" readOnly />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Website</label>
                <input type="url" placeholder="https://..." />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Facebook</label>
                <input type="url" placeholder="Nhập link facebook" />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Địa điểm</label>
                <input type="text" placeholder="Nhập địa điểm công ty" />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Mô tả</label>
                <input type="text" placeholder="Nhập mô tả công ty" />
              </div>

              <button className={styles.companySaveBtn}>Lưu</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}