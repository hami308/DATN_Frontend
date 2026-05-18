import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar_admin/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import styles from "./Home_admin.module.css";

export default function Home_admin() {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <Sidebar />

        <div className={styles.content}>
          <Dashboard />
        </div>
      </div>

      <Footer />
    </div>
  );
}
