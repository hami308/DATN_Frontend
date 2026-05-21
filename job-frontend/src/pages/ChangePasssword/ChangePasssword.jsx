import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./ChangePasssword.module.css";

import Sidebar from "../../components/Sidebar/Sidebar";
import MenuCard from "../../components/MenuCard/MenuCard";

import ChangePassword from "./components/ChangePassword_Form";

export default function ChangePasswordPage() {
  // =========================
  // GET USER FROM LOCALSTORAGE
  // =========================
  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.container}>
        {/* CHECK ROLE */}
        {role === "candidate" && <Sidebar />}

        {role === "recruiter" && <MenuCard />}

        <div className={styles.content}>
          <ChangePassword />
        </div>
      </div>

      <Footer />
    </div>
  );
}
