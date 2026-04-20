import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./ChangePasssword.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChangePassword from "./components/ChangePassword_Form";

export default function ChangePasswordPage() {
  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        <Sidebar />

        <div className={styles.content}>
          <ChangePassword />
        </div>
      </div>

      <Footer />
    </div>
  );
}
