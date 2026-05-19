import { useParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Candidate_Infor/Candidate_Infor.module.css";
import MenuCard from "../../components/MenuCard/MenuCard";
import ProfileCard from "../../components/ProfileForm/ProfileForm";
import Silebar_Admin from "../../components/Sidebar_admin/Sidebar";

export default function Recuiter_Infor() {
  const user= JSON.parse(localStorage.getItem("user"));
  const { profileId } = useParams();

  return (
    <div className={styles.recuiterInfor}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {user?.role === "recruiter" ? <MenuCard/> :     <Silebar_Admin />}


          <div className={styles.content}>
            <ProfileCard profileId={profileId} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}