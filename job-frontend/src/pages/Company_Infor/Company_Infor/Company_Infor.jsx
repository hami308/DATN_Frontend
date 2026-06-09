import React, { useEffect, useMemo, useRef, useState } from "react";

import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import MenuCard from "../../../components/MenuCard/MenuCard";

import styles from "./Company_Infor.module.css";
import "../Verify_paper/Verify_paper.css";

import business_paper from "../../../assets/images/business_paper.png";

import {
  getAllCompanies,
  getCompaniesByNameFromCompanyTable,
  getCompanyDetailById,
  updateCompany,
} from "../../../service/comapny/company_infor";

import { getRecruiterInfor } from "../../../service/recruiter/recruiter_infor";
import { getAllIndustries } from "../../../service/industry/industry";

import {
  createPendingCompany,
  getMyPendingCompanies,
} from "../../../service/comapny/pending_company";

import {
  getPublicFileUrl,
} from "../../../service/storage/public_file_upload";

export default function Company_Infor() {
  const fileRef = useRef(null);
  const fieldSelectRef = useRef(null);

  const [activeTab, setActiveTab] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [hasCompany, setHasCompany] = useState(false);
  const [companyStatus, setCompanyStatus] = useState(null);

  const [companyId, setCompanyId] = useState("");
  const [isOtherCompany, setIsOtherCompany] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [selectedFields, setSelectedFields] = useState([]);
  const [openField, setOpenField] = useState(false);
  const [fieldSearch, setFieldSearch] = useState("");

  const [pendingCompany, setPendingCompany] = useState(null);
  const [originalCompany, setOriginalCompany] = useState(null);

  const [savedCertificateUrl, setSavedCertificateUrl] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const [saving, setSaving] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const visibleTitle = companyName || "Tên công ty";
  const readonly = !isEditing;

  const visibleFieldOptions = industries.filter((industry) =>
    industry.name?.toLowerCase().includes(fieldSearch.trim().toLowerCase())
  );

  const isBlobUrl = (value) =>
    typeof value === "string" && value.startsWith("blob:");

  const getPublicAssetUrl = (value) => {
    if (!value || typeof value !== "string" || isBlobUrl(value)) return "";

    return getPublicFileUrl(value) || "";
  };

  const selectedPdfUrl = useMemo(() => {
    if (!certificateFile) return null;
    return URL.createObjectURL(certificateFile);
  }, [certificateFile]);

  useEffect(() => {
    return () => {
      if (selectedPdfUrl) URL.revokeObjectURL(selectedPdfUrl);
    };
  }, [selectedPdfUrl]);

  useEffect(() => {
    return () => {
      if (isBlobUrl(logo)) URL.revokeObjectURL(logo);
    };
  }, [logo]);

  const currentCertificateUrl =
    getPublicAssetUrl(pendingCompany?.certificate) || savedCertificateUrl;

  const currentPdfUrl = selectedPdfUrl || currentCertificateUrl || null;

  const currentFileName = certificateFile
    ? certificateFile.name
    : currentCertificateUrl
    ? "Giấy đăng ký doanh nghiệp.pdf"
    : "";

  const editButtonLabel = hasCompany
    ? "Tạo yêu cầu chỉnh sửa"
    : pendingCompany
    ? "Cập nhật yêu cầu công ty"
    : "Tạo yêu cầu công ty";

  const saveButtonLabel = hasCompany ? "Lưu thay đổi" : "Lưu yêu cầu công ty";

  const getCompanyId = (company) => company?.company_id || company?.id;
  const getIndustryId = (industry) => industry?.id || industry?.industry_id;

  const resetCompanyForm = () => {
    setCompanyName("");
    setTaxCode("");
    setWebsite("");
    setFacebook("");
    setLocation("");
    setDescription("");
    setLogo(null);
    setLogoFile(null);
    setSavedCertificateUrl("");
    setCertificateFile(null);
    setSelectedFields([]);
    setOriginalCompany(null);
  };

  const fillCompanyForm = (company) => {
    setCompanyName(company?.name || "");
    setTaxCode(company?.tax_code || "");
    setWebsite(company?.url_website || "");
    setFacebook(company?.url_facebook || "");
    setLocation(company?.location || "");
    setDescription(company?.description || "");
    setLogo(getPublicAssetUrl(company?.logo) || null);
    setLogoFile(null);
    setSavedCertificateUrl(getPublicAssetUrl(company?.certificate) || "");
    setCertificateFile(null);

    setSelectedFields(
      Array.isArray(company?.industries)
        ? company.industries.map((industry) => ({
            ...industry,
            id: getIndustryId(industry),
          }))
        : []
    );

    setOriginalCompany(company || null);
  };

  const getRecruiterCompanyId = (recruiter) =>
    recruiter?.company_id ||
    recruiter?.companyId ||
    recruiter?.company?.company_id ||
    recruiter?.company?.id;

  const getPendingCompaniesFromResponse = (response) => {
    const data =
      response?.pendingCompanies ||
      response?.data?.pendingCompanies ||
      response?.data ||
      response;

    if (Array.isArray(data)) return data;

    return data ? [data] : [];
  };

  const getLatestPendingCompany = (pendingCompanies) => {
    if (!pendingCompanies.length) return null;

    return [...pendingCompanies].sort((a, b) => {
      const aTime = new Date(a?.updated_at || a?.created_at || 0).getTime();
      const bTime = new Date(b?.updated_at || b?.created_at || 0).getTime();

      if (aTime !== bTime) return aTime - bTime;

      return (
        Number(a?.id || a?.pending_company_id || 0) -
        Number(b?.id || b?.pending_company_id || 0)
      );
    })[pendingCompanies.length - 1];
  };

  const getCompanyFromResponse = (response, selectedCompanyName) => {
    const data =
      response?.companies ||
      response?.data?.companies ||
      response?.data ||
      response;

    if (Array.isArray(data)) {
      return (
        data.find((item) => item?.name === selectedCompanyName) ||
        data[0] ||
        null
      );
    }

    return data?.company || data?.data?.company || data?.data || data;
  };

  const fillApprovedCompany = async (id, fallbackName) => {
    if (id) {
      const selectedCompanyRes = await getCompanyDetailById(id);

      const selectedCompany =
        selectedCompanyRes.company ||
        selectedCompanyRes.data?.company ||
        selectedCompanyRes.data ||
        selectedCompanyRes;

      fillCompanyForm(selectedCompany);
      setCompanyId(String(getCompanyId(selectedCompany) || id));
      setIsOtherCompany(false);

      return selectedCompany;
    }

    if (fallbackName) {
      const response = await getCompaniesByNameFromCompanyTable(fallbackName);
      const company = getCompanyFromResponse(response, fallbackName);

      if (company) {
        fillCompanyForm(company);
        setCompanyId(
          getCompanyId(company) ? String(getCompanyId(company)) : "other"
        );
        setIsOtherCompany(!getCompanyId(company));
      }

      return company;
    }

    return null;
  };

  const fetchInitialData = async () => {
    try {
      setFetchLoading(true);

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

      const pendingRes = await getMyPendingCompanies();
      const pendingCompanies = getPendingCompaniesFromResponse(pendingRes);
      const latestPending = getLatestPendingCompany(pendingCompanies);

      setPendingCompany(latestPending);

      if (recruiterCompanyId) {
        setIsEditing(false);
        setHasCompany(true);
        setCompanyStatus(latestPending?.status || "approved");
        setCompanyId(String(recruiterCompanyId));
        setIsOtherCompany(false);

        await fillApprovedCompany(recruiterCompanyId);
        return;
      }

      if (latestPending) {
        setIsEditing(false);

        const pendingStatus = latestPending.status || "pending";

        setCompanyStatus(pendingStatus);
        setCompanyId(
          latestPending.company_id ? String(latestPending.company_id) : "other"
        );
        setIsOtherCompany(!latestPending.company_id);

        if (pendingStatus === "approved") {
          const approvedCompany = await fillApprovedCompany(
            latestPending.company_id,
            latestPending.name
          );

          if (approvedCompany) {
            setHasCompany(true);
            return;
          }
        }

        setHasCompany(false);

        fillCompanyForm({
          name: latestPending.name,
          tax_code: latestPending.tax_code,
          url_website: latestPending.url_website,
          url_facebook: latestPending.url_facebook,
          location: latestPending.location,
          description: latestPending.description,
          logo: latestPending.logo,
          certificate: latestPending.certificate,
          industries: latestPending.industries || [],
        });

        return;
      }

      setHasCompany(false);
      setCompanyStatus(null);
      setCompanyId("");
      setIsOtherCompany(false);
      setDescriptionExpanded(false);
      setIsEditing(true);
      resetCompanyForm();
    } catch (error) {
      console.log("Lỗi lấy dữ liệu:", error);
    } finally {
      setFetchLoading(false);
    }
  };

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

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChangeCompany = async (e) => {
    const value = e.target.value;

    if (readonly) return;

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

    if (!selectedCompanyName) return;

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
    if (readonly) return;

    const file = e.target.files?.[0];

    if (file) {
      setLogoFile(file);
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    if (readonly) return;

    setLogo(null);
    setLogoFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const toggleField = (industry) => {
    if (readonly) return;

    setSelectedFields((prev) => {
      const industryId = getIndustryId(industry);

      const existed = prev.find(
        (item) => getIndustryId(item) === industryId
      );

      if (existed) {
        return prev.filter((item) => getIndustryId(item) !== industryId);
      }

      return [...prev, { ...industry, id: industryId }];
    });

    setFieldSearch("");
  };

  const removeField = (industryId) => {
    if (readonly) return;

    setSelectedFields((prev) =>
      prev.filter((item) => getIndustryId(item) !== industryId)
    );
  };

  const clearFields = (e) => {
    e.stopPropagation();

    if (readonly) return;

    setSelectedFields([]);
    setFieldSearch("");
  };

  const handleNextTab = () => {
    setActiveTab(2);
  };

  const isNormalCompanyInfoChanged = () => {
    return (
      website.trim() !== (originalCompany?.url_website || "").trim() ||
      facebook.trim() !== (originalCompany?.url_facebook || "").trim() ||
      location.trim() !== (originalCompany?.location || "").trim() ||
      description.trim() !== (originalCompany?.description || "").trim() ||
      Boolean(logoFile)
    );
  };

  const isSensitiveCompanyInfoChanged = (industryIds) => {
    const originalIndustryIds = Array.isArray(originalCompany?.industries)
      ? originalCompany.industries
          .map((industry) => Number(getIndustryId(industry)))
          .filter((id) => Number.isFinite(id))
          .sort((a, b) => a - b)
      : [];

    const currentIndustryIds = [...industryIds].sort((a, b) => a - b);

    const isNameChanged =
      companyName.trim() !== (originalCompany?.name || "").trim();

    const isTaxCodeChanged =
      taxCode.trim() !== (originalCompany?.tax_code || "").trim();

    const isIndustryChanged =
      JSON.stringify(currentIndustryIds) !==
      JSON.stringify(originalIndustryIds);

    const isCertificateChanged = Boolean(certificateFile);

    return (
      isNameChanged ||
      isTaxCodeChanged ||
      isIndustryChanged ||
      isCertificateChanged
    );
  };

  const buildFullCompanyFormData = async (industryIds) => {
    const formData = new FormData();

    if (companyId && companyId !== "other") {
      formData.append("company_id", String(companyId));
    }

    formData.append("name", companyName.trim());
    formData.append("tax_code", taxCode.trim());

    formData.append("url_website", website || "");
    formData.append("urlWebsite", website || "");

    formData.append("url_facebook", facebook || "");
    formData.append("urlFacebook", facebook || "");

    formData.append("location", location || "");
    formData.append("description", description || "");
    formData.append("industryIds", industryIds.join(","));

    if (logoFile) {
      formData.append("logo", logoFile);
    } else if (logo && !isBlobUrl(logo)) {
      formData.append("logo", logo);
    }

    if (certificateFile) {
      formData.append("certificate", certificateFile);
    } else if (currentCertificateUrl) {
      formData.append("certificate", currentCertificateUrl);
    }

    return formData;
  };

  const handleSubmitCompany = async () => {
    try {
      if (!companyName.trim()) {
        alert("Vui lòng nhập hoặc chọn tên công ty");
        return;
      }

      const industryIds = selectedFields
        .map((item) => Number(getIndustryId(item)))
        .filter((id) => Number.isFinite(id));

      if (industryIds.length === 0) {
        alert("Vui lòng chọn ít nhất một lĩnh vực hoạt động");
        return;
      }

      setSaving(true);

      const normalChanged = isNormalCompanyInfoChanged();
      const sensitiveChanged = isSensitiveCompanyInfoChanged(industryIds);

      const fullCompanyFormData = await buildFullCompanyFormData(industryIds);

      if (!hasCompany || sensitiveChanged) {
        await createPendingCompany(fullCompanyFormData);

        alert(
          hasCompany
            ? "Thông tin quan trọng đã được gửi admin duyệt."
            : "Tạo yêu cầu công ty thành công. Vui lòng chờ admin duyệt."
        );
      } else if (normalChanged) {
        await updateCompany(companyId, fullCompanyFormData);

        alert("Cập nhật thông tin công ty thành công.");
      } else {
        alert("Không có thông tin nào thay đổi.");
      }

      setIsEditing(false);
      setLogoFile(null);
      setCertificateFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      await fetchInitialData();
      setActiveTab(2);
    } catch (error) {
      console.log("Lỗi lưu thông tin công ty:", error);
      alert(error.response?.data?.message || "Lưu thông tin công ty thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleCertificateChange = (e) => {
    if (readonly) return;

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

    setCertificateFile(selectedFile);
  };

  const openPdfNewTab = () => {
    if (!currentPdfUrl) return;
    window.open(currentPdfUrl, "_blank", "noopener,noreferrer");
  };

  const renderStatus = () => {
    const status = companyStatus || pendingCompany?.status;

    if (!status) return null;

    if (status === "pending") {
      return <span className="verifyStatusPending">Chờ duyệt</span>;
    }

    if (status === "approved") {
      return <span className="verifyStatusAccept">Đã duyệt</span>;
    }

    if (status === "rejected") {
      return <span className="verifyStatusCancel">Từ chối</span>;
    }

    return null;
  };

  return (
    <div className={styles.company}>
      <Header />

      <main className={styles.companyMain}>
        <div className={styles.companyContainer}>
          <MenuCard />

          <div className={styles.companyContent}>
            <div className={styles.companyCard}>
              <div className={styles.companyTabs}>
                <button
                  type="button"
                  className={`${styles.companyTabBtn} ${
                    activeTab === 1 ? styles.companyTabActive : ""
                  }`}
                  onClick={() => setActiveTab(1)}
                >
                  1. Thông tin công ty
                </button>

                <button
                  type="button"
                  className={`${styles.companyTabBtn} ${
                    activeTab === 2 ? styles.companyTabActive : ""
                  }`}
                  onClick={() => setActiveTab(2)}
                >
                  2. Giấy đăng ký doanh nghiệp
                </button>
              </div>

              {fetchLoading ? (
                <div className={styles.companyLoading}>
                  <div className={styles.companySpinner} />
                  <p>Đang tải thông tin...</p>
                </div>
              ) : (
                activeTab === 1 && (
                  <>
                    <div className={styles.companyHeaderAction}>
                      <div className={styles.companyTitleRow}>
                        <h2>Thông tin công ty</h2>
                        {renderStatus()}
                      </div>

                      {!isEditing && companyStatus !== "pending" && (
                        <button
                          type="button"
                          className={styles.companyEditRequestBtn}
                          onClick={() => setIsEditing(true)}
                        >
                          {editButtonLabel}
                        </button>
                      )}
                    </div>

                    <div className={styles.companyHeader}>
                      <div className={styles.companyLogoWrapper}>
                        <div className={styles.companyLogo}>
                          {logo ? (
                            <img src={logo} alt="Company Logo" />
                          ) : (
                            <div className={styles.companyLogoPlaceholder} />
                          )}
                        </div>

                        {isEditing && (
                          <>
                            {logo && (
                              <button
                                type="button"
                                className={styles.companyRemoveLogoBtn}
                                onClick={handleRemoveLogo}
                                aria-label="Xóa logo công ty"
                              >
                                ×
                              </button>
                            )}

                            <button
                              type="button"
                              className={styles.companyUploadLogoBtn}
                              onClick={() => fileRef.current.click()}
                            >
                              <span className="material-symbols-outlined">
                                upload
                              </span>
                            </button>

                            <input
                              type="file"
                              ref={fileRef}
                              hidden
                              accept="image/*"
                              onChange={handleUploadLogo}
                            />
                          </>
                        )}
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
                        disabled={readonly}
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
                          readOnly={readonly}
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
                        readOnly={readonly}
                      />
                    </div>

                    <div className={styles.companyFormGroup}>
                      <label>Lĩnh vực hoạt động</label>

                      <div className={styles.multiSelect} ref={fieldSelectRef}>
                        <div
                          className={`${styles.multiSelectInput} ${
                            openField ? styles.multiSelectInputOpen : ""
                          } ${readonly ? styles.readonlyBox : ""}`}
                          onClick={() => {
                            if (!readonly) setOpenField(true);
                          }}
                        >
                          <div className={styles.tags}>
                            {readonly && selectedFields.length === 0 && (
                              <span className={styles.emptyFieldText}>
                                Chưa cập nhật
                              </span>
                            )}

                            {selectedFields.map((field) => (
                              <span
                                key={getIndustryId(field)}
                                className={styles.tag}
                              >
                                {field.name}

                                {!readonly && (
                                  <button
                                    type="button"
                                    className={styles.tagRemoveBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeField(getIndustryId(field));
                                    }}
                                  >
                                    ×
                                  </button>
                                )}
                              </span>
                            ))}

                            {!readonly && (
                              <input
                                type="text"
                                value={fieldSearch}
                                onChange={(e) =>
                                  setFieldSearch(e.target.value)
                                }
                                onFocus={() => setOpenField(true)}
                                className={`${styles.fieldSearch} ${
                                  selectedFields.length > 0
                                    ? styles.hideSearch
                                    : ""
                                }`}
                                placeholder={
                                  selectedFields.length > 0
                                    ? ""
                                    : "Chọn lĩnh vực"
                                }
                              />
                            )}
                          </div>

                          {!readonly && selectedFields.length > 0 && (
                            <button
                              type="button"
                              className={styles.clearBtn}
                              onClick={clearFields}
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {!readonly && openField && (
                          <div className={styles.dropdown}>
                            {visibleFieldOptions.map((field) => (
                              <button
                                key={getIndustryId(field)}
                                type="button"
                                className={`${styles.option} ${
                                  selectedFields.some(
                                    (item) =>
                                      getIndustryId(item) ===
                                      getIndustryId(field)
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
                        readOnly={readonly}
                      />
                    </div>

                    <div className={styles.companyFormGroup}>
                      <label>Facebook</label>
                      <input
                        type="url"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="Nhập link facebook"
                        readOnly={readonly}
                      />
                    </div>

                    <div className={styles.companyFormGroup}>
                      <label>Địa điểm</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Nhập địa điểm công ty"
                        readOnly={readonly}
                      />
                    </div>

                    <div
                      className={`${styles.companyFormGroup} ${styles.descriptionFormGroup}`}
                    >
                      <label>Mô tả</label>

                      <div className={styles.descriptionField}>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Nhập mô tả công ty"
                          readOnly={readonly}
                          rows={descriptionExpanded || !readonly ? 5 : 2}
                          className={
                            descriptionExpanded || !readonly
                              ? styles.descriptionTextareaExpanded
                              : styles.descriptionTextareaCollapsed
                          }
                        />

                        {readonly && description.length > 120 && (
                          <button
                            type="button"
                            className={styles.descriptionToggleBtn}
                            onClick={() =>
                              setDescriptionExpanded(
                                (isExpanded) => !isExpanded
                              )
                            }
                          >
                            {descriptionExpanded ? "Thu gọn" : "Xem thêm"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.companyButtonRow}>
                      <button
                        type="button"
                        className={styles.companyNextBtn}
                        onClick={handleNextTab}
                      >
                        Tiếp theo
                      </button>
                    </div>
                  </>
                )
              )}

              {!fetchLoading && activeTab === 2 && (
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
                      onChange={handleCertificateChange}
                      className="verifyPaperInput"
                      disabled={readonly}
                    />

                    {!readonly && (
                      <label
                        htmlFor="verifyPaperUpload"
                        className="verifyPaperUploadBtn"
                      >
                        Chọn tệp PDF
                      </label>
                    )}

                    {currentPdfUrl && (
                      <div
                        className="verifyPaperUploadedFile clickable"
                        onClick={openPdfNewTab}
                      >
                        <span className="material-symbols-outlined">
                          picture_as_pdf
                        </span>
                        <span className="verifyPaperFileLink">
                          {currentFileName}
                        </span>
                      </div>
                    )}

                    {!readonly && (
                      <p className="verifyPaperLabel">
                        Chọn hoặc kéo file PDF vào đây
                      </p>
                    )}

                    <p className="verifyPaperNote">
                      Dung lượng tối đa 5MB, định dạng: PDF
                    </p>

                    {pendingCompany?.status === "rejected" &&
                      pendingCompany?.reject_reason && (
                        <p className="verifyPaperNote">
                          Lý do từ chối: {pendingCompany.reject_reason}
                        </p>
                      )}
                  </div>

                  <div className="verifyPaperWarning">
                    <span className="material-symbols-outlined">warning</span>
                    Các văn bản đăng tải cần đầy đủ thông tin, rõ nét và không
                    có dấu hiệu chỉnh sửa.
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

                  <div className={styles.companyVerifyActions}>
                    <button
                      type="button"
                      className={styles.companyBackBtn}
                      onClick={() => setActiveTab(1)}
                    >
                      Quay lại
                    </button>

                    {isEditing && (
                      <button
                        type="button"
                        className={styles.companySaveBtn}
                        onClick={handleSubmitCompany}
                        disabled={saving}
                      >
                        {saving ? "Đang lưu..." : saveButtonLabel}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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
    </div>
  );
}
