import React, { useEffect, useMemo, useState } from "react";
import "./Verify_paper.css";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import MenuCard from "../../../components/MenuCard/MenuCard";

import business_paper from "../../../assets/images/business_paper.png";

import {
  getMyPendingCompanies,
  updatePendingCompanyCertificate,
} from "../../../service/comapny/pending_company";

export default function Verify_paper() {
  const [pendingCompany, setPendingCompany] = useState(null);
  const [file, setFile] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchPendingCompany();
  }, []);

  const fetchPendingCompany = async () => {
    try {
      setFetchLoading(true);

      const result = await getMyPendingCompanies();
      const pendingCompanies = result?.data?.pendingCompanies || [];

      setPendingCompany(pendingCompanies[0] || null);
    } catch (error) {
      console.error("Lỗi lấy thông tin công ty chờ duyệt:", error);
      setPendingCompany(null);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Vui lòng chọn file PDF");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File không được vượt quá 5MB");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSave = async () => {
    try {
      if (!pendingCompany?.id) {
        alert("Bạn chưa có thông tin công ty chờ duyệt");
        return;
      }

      if (!file) {
        alert("Vui lòng chọn file PDF");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("certificate", file);

      const result = await updatePendingCompanyCertificate(formData);

      alert(result.message || "Cập nhật giấy chứng nhận thành công");

      setFile(null);
      await fetchPendingCompany();
    } catch (error) {
      console.error("Lỗi cập nhật giấy chứng nhận:", error);

      alert(
        error.response?.data?.message ||
          "Cập nhật giấy chứng nhận thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  const status = pendingCompany?.status || null;
  const hasCertificate = Boolean(pendingCompany?.certificate);
  const hasSelectedFile = Boolean(file);

  const selectedPdfUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (selectedPdfUrl) {
        URL.revokeObjectURL(selectedPdfUrl);
      }
    };
  }, [selectedPdfUrl]);

  const currentPdfUrl = selectedPdfUrl || pendingCompany?.certificate || null;

  const currentFileName = file
    ? file.name
    : hasCertificate
    ? "Giấy đăng ký doanh nghiệp.pdf"
    : "";

  const showUploadBox =
    !hasCertificate || status === "rejected" || hasSelectedFile;

  const openPdfNewTab = () => {
    if (!currentPdfUrl) return;
    window.open(currentPdfUrl, "_blank", "noopener,noreferrer");
  };

  const renderStatus = () => {
    if (!hasCertificate) return null;

    switch (status) {
      case "pending":
        return <span className="verifyStatusPending">Chờ duyệt</span>;
      case "approved":
        return <span className="verifyStatusAccept">Đã duyệt</span>;
      case "rejected":
        return <span className="verifyStatusCancel">Từ chối</span>;
      default:
        return null;
    }
  };

  const renderFileInfo = () => (
    <div className="verifyPaperUploadedFile clickable" onClick={openPdfNewTab}>
      <span className="material-symbols-outlined">picture_as_pdf</span>
      <span className="verifyPaperFileLink">{currentFileName}</span>
    </div>
  );

  return (
    <>
      <Header />

      <div className="verifyPaperPage">
        <MenuCard />

        <div className="verifyPaperContainer">
          <div className="verifyPaperTop">
            <h2>Thông tin giấy đăng ký doanh nghiệp</h2>
            {renderStatus()}
          </div>

          <p className="verifyPaperNote">
            Vui lòng tải lên giấy đăng ký doanh nghiệp dạng PDF
          </p>

          <div className="verifyPaperBox">
            {fetchLoading ? (
              <p className="verifyPaperNote">Đang tải thông tin...</p>
            ) : (
              <>
                <input
                  type="file"
                  id="verifyPaperUpload"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="verifyPaperInput"
                />

                {showUploadBox && (
                  <>
                    <label
                      htmlFor="verifyPaperUpload"
                      className="verifyPaperUploadBtn"
                    >
                      Chọn tệp PDF
                    </label>

                    {(hasSelectedFile || hasCertificate) && renderFileInfo()}

                    <p className="verifyPaperLabel">
                      Chọn hoặc kéo file PDF vào đây
                    </p>

                    <p className="verifyPaperNote">
                      Dung lượng tối đa 5MB, định dạng: PDF
                    </p>
                  </>
                )}

                {!showUploadBox && hasCertificate && renderFileInfo()}

                {status === "rejected" && pendingCompany?.reject_reason && (
                  <p className="verifyPaperNote">
                    Lý do từ chối: {pendingCompany.reject_reason}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="verifyPaperWarning">
            <span className="material-symbols-outlined">warning</span>
            Các văn bản đăng tải cần đầy đủ thông tin, rõ nét và không có dấu
            hiệu chỉnh sửa.
          </div>

          <div className="verifyPaperIllustration">
            <p>Minh họa</p>

            <div className="verifyPaperSampleDoc">
              <img
                src={business_paper}
                alt="Minh họa giấy phép"
                className="verifyPaperSampleImage"
                onClick={() => setZoom(true)}
              />
            </div>
          </div>

          {status !== "approved" && (
            <button
              className="verifyPaperSaveBtn"
              onClick={handleSave}
              disabled={loading || fetchLoading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          )}
        </div>
      </div>

      {zoom && (
        <div className="verifyPaperModal" onClick={() => setZoom(false)}>
          <img
            src={business_paper}
            alt="Zoom"
            className="verifyPaperZoomImage"
          />
        </div>
      )}

      <Footer />
    </>
  );
}
