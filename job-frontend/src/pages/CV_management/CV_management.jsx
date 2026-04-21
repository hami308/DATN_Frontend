import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./CV_management.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import CV_management from "./components/CV_management_form";

export default function Homepage() {
  return (
    <div className={styles.homepage}>
      <Header />

      <div className={styles.main}>
        <Sidebar />
        <div className={styles.content}>
          <CV_management />
        </div>
      </div>

      <Footer />
    </div>
  );
}
