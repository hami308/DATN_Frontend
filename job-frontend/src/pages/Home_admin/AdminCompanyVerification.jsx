import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "./components/Sidebar/Sidebar";
import CompanyVerification from "./components/CompanyVerification/CompanyVerification";
import styles from "./Home_admin.module.css";

export default function AdminCompanyVerification() {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <Sidebar />

        <div className={styles.content}>
          <CompanyVerification />
        </div>
      </div>

      <Footer />
    </div>
  );
}
