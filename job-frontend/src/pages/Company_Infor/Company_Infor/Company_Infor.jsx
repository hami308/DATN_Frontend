import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import MenuCard from "../../../components/MenuCard/MenuCard";
import styles from "./Company_Infor.module.css";

import {
  getAllCompanies,
  getCompaniesByNameFromCompanyTable,
  getCompanyInfor,
} from "../../../service/comapny/company_infor";

import { getRecruiterInfor } from "../../../service/recruiter/recruiter_infor";
import { getAllIndustries } from "../../../service/industry/industry";

import {
  createPendingCompany,
  getMyPendingCompanies,
} from "../../../service/comapny/pending_company";

export default function Company_Infor() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const fieldSelectRef = useRef(null);

  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [hasCompany, setHasCompany] = useState(false);

  const [companyId, setCompanyId] = useState("");
  const [isOtherCompany, setIsOtherCompany] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);

  const [selectedFields, setSelectedFields] = useState([]);
  const [openField, setOpenField] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const visibleTitle = companyName || "Tên công ty";

  const visibleFieldOptions = industries.filter((industry) =>
    industry.name?.toLowerCase().includes(fieldSearch.trim().toLowerCase())
  );

  const resetCompanyForm = () => {
    setCompanyName("");
    setTaxCode("");
    setWebsite("");
    setFacebook("");
    setLocation("");
    setDescription("");
    setLogo(null);
    setSelectedFields([]);
  };

  const fillCompanyForm = (company) => {
    setCompanyName(company?.name || "");
    setTaxCode(company?.tax_code || "");
    setWebsite(company?.url_website || "");
    setFacebook(company?.url_facebook || "");
    setLocation(company?.location || "");
    setDescription(company?.description || "");
    setLogo(company?.logo || null);
    setSelectedFields(
      Array.isArray(company?.industries) ? company.industries : []
    );
  };

  const getCompanyFromResponse = (response, selectedCompanyName) => {
    const companiesData =
      response?.companies ||
      response?.data?.companies ||
      response?.data ||
      response;

    if (Array.isArray(companiesData)) {
      return (
        companiesData.find((company) => company?.name === selectedCompanyName) ||
        companiesData[0] ||
        null
      );
    }

    return (
      companiesData?.company ||
      companiesData?.data?.company ||
      companiesData?.data ||
      companiesData
    );
  };

  const getRecruiterCompanyId = (recruiter) =>
    recruiter?.company_id ||
    recruiter?.companyId ||
    recruiter?.company?.company_id ||
    recruiter?.company?.id;

  const getPendingCompaniesFromResponse = (response) => {
    const pendingCompanies =
      response?.pendingCompanies ||
      response?.data?.pendingCompanies ||
      response?.data ||
      response;

    if (Array.isArray(pendingCompanies)) {
      return pendingCompanies;
    }

    return pendingCompanies ? [pendingCompanies] : [];
  };

  async function fetchInitialData() {
    try {
      const companyRes = await getAllCompanies();
      const companyData =
        companyRes.companies ||
        companyRes.data?.companies ||
        companyRes.data ||
        companyRes;

      setCompanies(Array.isArray(companyData) ? companyData : []);

      const industryRes = await getAllIndustries();
      const industryData =
        industryRes.industries ||
        industryRes.data?.industries ||
        industryRes.data ||
        industryRes;

      setIndustries(Array.isArray(industryData) ? industryData : []);

      const recruiterRes = await getRecruiterInfor();

      const recruiterData =
        recruiterRes.recruiter ||
        recruiterRes.data?.recruiter ||
        recruiterRes.data ||
        recruiterRes;

      const recruiterCompanyId = getRecruiterCompanyId(recruiterData);

      if (recruiterCompanyId) {
        setHasCompany(true);
        setIsOtherCompany(false);
        setCompanyId(String(recruiterCompanyId));

        const selectedCompanyRes = await getCompanyInfor(recruiterCompanyId);

        const selectedCompany =
          selectedCompanyRes.company ||
          selectedCompanyRes.data?.company ||
          selectedCompanyRes.data ||
          selectedCompanyRes;

        fillCompanyForm(selectedCompany);
        return;
      }

      setHasCompany(false);

      const pendingRes = await getMyPendingCompanies();
      const pendingCompanies = getPendingCompaniesFromResponse(pendingRes);

      if (Array.isArray(pendingCompanies) && pendingCompanies.length > 0) {
        const pendingCompany = pendingCompanies[pendingCompanies.length - 1];

        setCompanyId(
          pendingCompany.company_id
            ? String(pendingCompany.company_id)
            : "other"
        );

        setIsOtherCompany(!pendingCompany.company_id);

        fillCompanyForm({
          name: pendingCompany.name,
          tax_code: pendingCompany.tax_code,
          url_website: pendingCompany.url_website,
          url_facebook: pendingCompany.url_facebook,
          location: pendingCompany.location,
          description: pendingCompany.description,
          logo: pendingCompany.logo,
          industries: pendingCompany.industries || [],
        });

        return;
      }

      setCompanyId("");
      setIsOtherCompany(false);
      resetCompanyForm();
    } catch (error) {
      console.log("Lỗi lấy dữ liệu:", error);
    }
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        fieldSelectRef.current &&
        !fieldSelectRef.current.contains(e.target)
      ) {
        setOpenField(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChangeCompany = async (e) => {
    const value = e.target.value;

    if (value === "other") {
      setCompanyId("other");
      setIsOtherCompany(true);
      resetCompanyForm();
      return;
    }

    setCompanyId(value);
    setIsOtherCompany(false);

    if (!value) {
      resetCompanyForm();
      return;
    }

    const selectedCompany = companies.find(
      (company) => String(company.company_id || company.id) === String(value)
    );

    const selectedCompanyName = selectedCompany?.name;

    if (!selectedCompanyName) {
      resetCompanyForm();
      return;
    }

    try {
      const response = await getCompaniesByNameFromCompanyTable(
        selectedCompanyName
      );

      const company = getCompanyFromResponse(response, selectedCompanyName);

      fillCompanyForm(company);
    } catch (error) {
      console.log("Lỗi lấy thông tin công ty:", error);
    }
  };

  const handleUploadLogo = (e) => {
    const file = e.target.files[0];

    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const toggleField = (industry) => {
    setSelectedFields((prev) => {
      const existed = prev.find((item) => item.id === industry.id);

      if (existed) {
        return prev.filter((item) => item.id !== industry.id);
      }

      return [...prev, industry];
    });

    setFieldSearch("");
  };

  const removeField = (industryId) => {
    setSelectedFields((prev) =>
      prev.filter((item) => item.id !== industryId)
    );
  };

  const clearFields = (e) => {
    e.stopPropagation();
    setSelectedFields([]);
    setFieldSearch("");
  };

  const handleSubmit = async () => {
    try {
      if (!companyName.trim()) {
        alert("Vui lòng nhập hoặc chọn tên công ty");
        return;
      }

      const industryIds = selectedFields.map((item) => Number(item.id));

      if (industryIds.length === 0) {
        alert("Vui lòng chọn ít nhất một lĩnh vực hoạt động");
        return;
      }

      const payload = {
        company_id:
          companyId && companyId !== "other" ? Number(companyId) : null,
        name: companyName,
        tax_code: taxCode,
        url_website: website,
        url_facebook: facebook,
        location,
        description,
        logo,
        industryIds,
      };

      setSaving(true);

      await createPendingCompany(payload);

      if (!hasCompany) {
        alert(
          "Đã lưu thông tin công ty. Vui lòng tải lên giấy đăng ký doanh nghiệp để tạo thông tin công ty"
        );

        navigate("/business-paper");
        return;
      }

      alert("Tạo yêu cầu chỉnh sửa thông tin công ty thành công");
      navigate("/company-edit-request");
    } catch (error) {
      console.log("Lỗi lưu pending company:", error);
      alert(error.response?.data?.message || "Lưu thông tin công ty thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.company}>
      <Header />

      <main className={styles.companyMain}>
        <div className={styles.companyContainer}>
          <MenuCard />

          <div className={styles.companyContent}>
            <div className={styles.companyCard}>
              <div className={styles.companyHeader}>
                <div className={styles.companyLogoWrapper}>
                  <div className={styles.companyLogo}>
                    {logo ? (
                      <img src={logo} alt="Company Logo" />
                    ) : (
                      <div className={styles.companyLogoPlaceholder} />
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.companyUploadLogoBtn}
                    onClick={() => fileRef.current.click()}
                  >
                    <span className="material-symbols-outlined">upload</span>
                  </button>

                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={handleUploadLogo}
                  />
                </div>

                <div className={styles.companyInfo}>
                  <h3>{visibleTitle}</h3>
                </div>
              </div>

              <div className={styles.companyFormGroup}>
                <label>Tên công ty</label>

                <select
                  value={companyId}
                  onChange={handleChangeCompany}
                  className={styles.companySelect}
                >
                  <option value="">Chọn công ty</option>

                  {companies.map((company) => (
                    <option
                      key={company.company_id || company.id}
                      value={company.company_id || company.id}
                    >
                      {company.name}
                    </option>
                  ))}

                  <option value="other">Khác</option>
                </select>

                {isOtherCompany && (
                  <input
                    type="text"
                    className={styles.otherCompanyInput}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nhập tên công ty"
                  />
                )}
              </div>

              <div className={styles.companyFormGroup}>
                <label>Mã số thuế</label>

                <input
                  type="text"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  placeholder="Nhập mã số thuế"
                />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Lĩnh vực hoạt động</label>

                <div className={styles.multiSelect} ref={fieldSelectRef}>
                  <div
                    className={`${styles.multiSelectInput} ${
                      openField ? styles.multiSelectInputOpen : ""
                    }`}
                    onClick={() => setOpenField(true)}
                  >
                    <div className={styles.tags}>
                      {selectedFields.map((field) => (
                        <span key={field.id} className={styles.tag}>
                          {field.name}

                          <button
                            type="button"
                            className={styles.tagRemoveBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                            aria-label={`Xóa ${field.name}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      <input
                        type="text"
                        value={fieldSearch}
                        onChange={(e) => setFieldSearch(e.target.value)}
                        onFocus={() => setOpenField(true)}
                        className={`${styles.fieldSearch} ${
                          selectedFields.length > 0 ? styles.hideSearch : ""
                        }`}
                        placeholder={
                          selectedFields.length > 0 ? "" : "Chọn lĩnh vực"
                        }
                      />
                    </div>

                    {selectedFields.length > 0 && (
                      <button
                        type="button"
                        className={styles.clearBtn}
                        onClick={clearFields}
                        aria-label="Xóa tất cả lĩnh vực"
                      >
                        ×
                      </button>
                    )}

                    <button
                      type="button"
                      className={styles.arrow}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenField((isOpen) => !isOpen);
                      }}
                      aria-label="Mở danh sách lĩnh vực"
                    >
                      <span className="material-symbols-outlined">
                        stat_minus_1
                      </span>
                    </button>
                  </div>

                  {openField && (
                    <div className={styles.dropdown}>
                      <button
                        type="button"
                        className={styles.option}
                        onClick={() => {
                          setSelectedFields([]);
                          setFieldSearch("");
                        }}
                      >
                        Tất cả
                      </button>

                      {visibleFieldOptions.map((field) => (
                        <button
                          key={field.id}
                          type="button"
                          className={`${styles.option} ${
                            selectedFields.some(
                              (item) => item.id === field.id
                            )
                              ? styles.activeOption
                              : ""
                          }`}
                          onClick={() => toggleField(field)}
                        >
                          {field.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.companyFormGroup}>
                <label>Website</label>

                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Facebook</label>

                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="Nhập link facebook"
                />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Địa điểm</label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Nhập địa điểm công ty"
                />
              </div>

              <div className={styles.companyFormGroup}>
                <label>Mô tả</label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả công ty"
                />
              </div>

              <button
                type="button"
                className={styles.companySaveBtn}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving
                  ? "Đang lưu..."
                  : hasCompany
                  ? "Tạo yêu cầu chỉnh sửa"
                  : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
