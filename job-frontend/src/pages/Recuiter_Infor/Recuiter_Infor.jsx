import { useEffect, useState } from "react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Candidate_Infor/Candidate_Infor.module.css";
import MenuCard from "../../components/MenuCard/MenuCard";
import ProfileCard from "../../components/ProfileForm/ProfileForm";

import { getRecruiterInfor } from "../../service/recruiter/recruiter_infor";

export default function Recuiter_Infor() {
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecruiter = async () => {
      try {
        setLoading(true);

        const user = JSON.parse(localStorage.getItem("user"));
        const response = await getRecruiterInfor(user.id);
        
        setRecruiter(response.data.recruiter);
      } catch (error) {
        setError(
          error.message ||
            error.response?.data?.message ||
            "Lấy thông tin thất bại"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiter();
  }, []);

  return (
    <div className={styles.recuiterInfor}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <MenuCard />

          <div className={styles.content}>
            {loading && <p>Đang tải...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (
              <ProfileCard recruiter={recruiter} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}