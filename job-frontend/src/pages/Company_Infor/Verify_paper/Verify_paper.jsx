import React, { useState } from "react";
import "./Verify_paper.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import MenuCard from "../../../components/MenuCard/MenuCard";
import business_paper from "../../../assets/images/business_paper.png";

export default function Verify_paper() {
  const status = "cancel"; // null | pending | cancel | accept
  const existingFileName = "2.1. Survey.pdf";

  const [file, setFile] = useState(null);
  const [zoom, setZoom] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  // Tên file hiện tại
  const currentFileName = file ? file.name : existingFileName;

  // URL lấy chính theo name
  const currentPdfUrl = file
    ? URL.createObjectURL(file)
    : `/${currentFileName}`;

  const openPdfNewTab = () => {
    window.open(currentPdfUrl, "_blank");
  };

  const renderStatus = () => {
    switch (status) {
      case "pending":
        return <span className="verifyStatusPending">Chờ duyệt</span>;

      case "cancel":
        return <span className="verifyStatusCancel">Từ chối</span>;

      case "accept":
        return <span className="verifyStatusAccept">Chấp nhận</span>;

      default:
        return null;
    }
  };

  const renderFileInfo = () => (
    <div
      className="verifyPaperUploadedFile clickable"
      onClick={openPdfNewTab}
    >
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
            <input
              type="file"
              id="verifyPaperUpload"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="verifyPaperInput"
            />

            {/* status null */}
            {status === null && (
              <>
                <label
                  htmlFor="verifyPaperUpload"
                  className="verifyPaperUploadBtn"
                >
                  Chọn tệp PDF
                </label>

                <p className="verifyPaperLabel">
                  Chọn hoặc kéo file PDF vào đây
                </p>

                <p className="verifyPaperNote">
                  Dung lượng tối đa 5MB, định dạng: PDF
                </p>
              </>
            )}

            {/* pending + accept */}
            {(status === "pending" || status === "accept") &&
              renderFileInfo()}

            {/* cancel */}
            {status === "cancel" && (
              <>
                <label
                  htmlFor="verifyPaperUpload"
                  className="verifyPaperUploadBtn"
                >
                  Chọn tệp PDF
                </label>

                {renderFileInfo()}

                <p className="verifyPaperLabel">
                  Chọn hoặc kéo file PDF vào đây
                </p>

                <p className="verifyPaperNote">
                  Dung lượng tối đa 5MB, định dạng: PDF
                </p>
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

          {status !== "accept" && (
            <button className="verifyPaperSaveBtn">Lưu</button>
          )}
        </div>
      </div>

      {zoom && (
        <div
          className="verifyPaperModal"
          onClick={() => setZoom(false)}
        >
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