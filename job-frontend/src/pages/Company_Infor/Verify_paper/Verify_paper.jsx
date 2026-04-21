import React, { useState } from "react";
import "./Verify_paper.css";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import MenuCard from "../../../components/MenuCard/MenuCard";
import business_paper from "../../../assets/images/business_paper.png";

export default function Verify_paper() {
  const [file, setFile] = useState(null);
  const [zoom, setZoom] = useState(false);
  console.log("Selected file:", file);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <>
      <Header />

      <div className="verifyPaperPage">
        <MenuCard />

        <div className="verifyPaperContainer">
          <h2>Thông tin giấy đăng ký doanh nghiệp</h2>
          <p>Vui lòng tải lên giấy đăng ký doanh nghiệp hoặc giấy tờ tương đương khác</p>

          <div className="verifyPaperBox">
            <input
              type="file"
              id="verifyPaperUpload"
              accept=".png,.jpg,.pdf"
              onChange={handleFileChange}
              className="verifyPaperInput"
            />

            <label htmlFor="verifyPaperUpload" className="verifyPaperUploadBtn">
              Chọn tệp
            </label>

            <p className="verifyPaperFileName">
              {file ? file.name : "Chưa chọn tệp nào"}
            </p>

            <p className="verifyPaperLabel">
              Chọn hoặc kéo file vào đây
            </p>

            <p className="verifyPaperNote">
              Dung lượng tối đa 5MB, định dạng: png, jpg, pdf
            </p>
          </div>

          <div className="verifyPaperWarning">
            <span class="material-symbols-outlined">warning</span>
            Các văn bản đăng tải cần đầy đủ các mặt và không có dấu hiệu chỉnh sửa/che/cắt thông tin
          </div>

          <div className="verifyPaperIllustration">
            <p>Minh họa</p>

            <div className="verifyPaperSampleDoc">
              <img
                src={business_paper}
                alt="Sample Document"
                className="verifyPaperSampleImage"
                onClick={() => setZoom(true)}
              />
            </div>
          </div>

          <button className="verifyPaperSaveBtn">Lưu</button>
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