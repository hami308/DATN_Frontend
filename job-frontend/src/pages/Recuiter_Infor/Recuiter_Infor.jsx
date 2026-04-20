import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Candidate_Infor/Candidate_Infor.module.css";
import MenuCard from "../../components/MenuCard/MenuCard";
import ProfileCard from "../../components/ProfileForm/ProfileForm";

export default function Recuiter_Infor() {
  return (
    <div className={styles.recuiterInfor}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <MenuCard />
          <div className={styles.content}>
            <ProfileCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
