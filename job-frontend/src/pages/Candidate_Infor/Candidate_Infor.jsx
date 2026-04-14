import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Candidate_Infor.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import ProfileCard from "../../components/ProfileForm/ProfileForm";

export default function Candidate_Infor() {
  return (
    <div className={styles.candidateInfor}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <Sidebar />
          <div className={styles.content}>
            <ProfileCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
