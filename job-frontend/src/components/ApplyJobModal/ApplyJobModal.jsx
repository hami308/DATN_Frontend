import { useEffect, useState } from "react";

import styles from "./ApplyJobModal.module.css";

import { getCVDisplayName, getMyCVsApi } from "../../service/cv/cv_service";

import { applyJobApi } from "../../service/candidate/application_service";

export default function ApplyJobModal({ jobId, onClose }) {
  const [cvs, setCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [cvLoading, setCvLoading] = useState(true);

  const [loading, setLoading] = useState(false);

  const fetchCVs = async () => {
    setCvLoading(true);

    try {
      const response = await getMyCVsApi();

      const list = response?.data?.data || [];

      setCvs(list);

      const defaultCv = list.find((cv) => cv.is_default);

      setSelectedCvId(defaultCv?.id || list[0]?.id || "");
    } catch (error) {
      console.error(error);
    } finally {
      setCvLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const handleApply = async () => {
    try {
      if (!selectedCvId) {
        alert("Bạn cần có CV trước khi ứng tuyển.");
        return;
      }

      setLoading(true);

      const response = await applyJobApi({
        jobId,
        cvId: selectedCvId,
      });

      alert(response.data.message || "Ứng tuyển thành công.");

      onClose();
    } catch (error) {
      alert(error?.message || error?.data?.message || "Ứng tuyển thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Chọn CV để ứng tuyển</h3>

        {cvLoading ? (
          <div className={styles.loadingState}>Đang tải danh sách CV...</div>
        ) : (
          <>
            <div className={styles.cvList}>
              {cvs.length > 0 ? (
                cvs.map((cv) => (
                  <div key={cv.id} className={styles.cvItem}>
                    <label>
                      <input
                        type="radio"
                        name="cv"
                        value={cv.id}
                        checked={Number(selectedCvId) === Number(cv.id)}
                        onChange={(e) => setSelectedCvId(e.target.value)}
                      />

                      <span>
                        {getCVDisplayName(cv)}

                        {cv.is_default && (
                          <span className={styles.defaultText}> - Mặc định</span>
                        )}
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <p>Bạn chưa có CV. Vui lòng tải CV trong mục Quản lý CV trước.</p>
              )}
            </div>

            <div className={styles.actions}>
              <button
                className={styles.cancelBtn}
                type="button"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </button>

              <button
                className={styles.submitBtn}
                type="button"
                onClick={handleApply}
                disabled={loading || cvs.length === 0}
              >
                {loading ? "Đang ứng tuyển..." : "Xác nhận ứng tuyển"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
