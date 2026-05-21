import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./Candidate_Infor.module.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Silebar_Admin from "../../components/Sidebar_admin/Sidebar";
import ProfileCard from "./components/CandidateProfileForm";

export default function Candidate_Infor() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { profileId } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.candidateInfor}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {user?.role === "candidate" && <Sidebar />}
          {user?.role === "admin" && <Silebar_Admin />}

          <div className={styles.content}>
            {user?.role === "admin" && (
              <button
                type="button"
                className={styles.adminBackButton}
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={18} />
                Quay lại
              </button>
            )}

            <ProfileCard profileId={profileId} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
