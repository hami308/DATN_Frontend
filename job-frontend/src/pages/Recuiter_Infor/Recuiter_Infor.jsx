import React, { useState } from "react";
import "./Recuiter_Infor.css";
import MenuCard from "../../components/MenuCard/MenuCard";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ProfileForm() {
  const [collapsed, setCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    name: "Nguyễn Hà My",
    email: "nguyenhamy2000.td@gmail.com",
    phone: "",
    address: "",
    gender: "",
    birthday: null,
    img: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      birthday: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Dữ liệu đã lưu:", formData);
  };

  return (
    <>
      <Header />

      <div className="recruiter-profile-layout">
        <MenuCard
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div
          className={`recruiter-profile-page ${
            collapsed
              ? "recruiter-profile-sidebar-close"
              : "recruiter-profile-sidebar-open"
          }`}
        >
          <div className="recruiter-profile-wrapper">
            <form
              className="recruiter-profile-card"
              onSubmit={handleSubmit}
            >
              {/* Header */}
              <div className="recruiter-profile-header">
                <div className="recruiter-profile-avatar">
                  <img
                    src={
                      formData.img ||
                      "https://via.placeholder.com/80"
                    }
                    alt="Avatar"
                  />
                </div>

                <div className="recruiter-profile-info">
                  <h3>{formData.name}</h3>
                  <p>{formData.email}</p>
                </div>
              </div>

              {/* Họ tên */}
              <div className="recruiter-profile-form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="recruiter-profile-form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                />
              </div>

              {/* SĐT */}
              <div className="recruiter-profile-form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Địa chỉ */}
              <div className="recruiter-profile-form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Nhập địa chỉ"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Giới tính */}
              <div className="recruiter-profile-form-group recruiter-profile-gender-group">
                <label>Giới tính</label>

                <div className="recruiter-profile-gender-options">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Nam"
                      checked={formData.gender === "Nam"}
                      onChange={handleChange}
                    />
                    Nam
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={formData.gender === "Nữ"}
                      onChange={handleChange}
                    />
                    Nữ
                  </label>
                </div>
              </div>

              {/* Ngày sinh */}
              <div className="recruiter-profile-form-group">
                <label>Ngày sinh</label>

                <DatePicker
                  selected={formData.birthday}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  className="recruiter-profile-datepicker"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  maxDate={new Date()}
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="recruiter-profile-save-btn"
              >
                Lưu
              </button>
            </form>
          </div>

          
        </div>
      </div>
      <Footer collapsed={collapsed} />
    </>
  );
}

export default ProfileForm;