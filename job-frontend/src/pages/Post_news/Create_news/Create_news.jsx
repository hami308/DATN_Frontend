import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ChevronDown } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "./Create_news.css";
import Header from "../../../components/Header/Header";
import MenuCard from "../../../components/MenuCard/MenuCard";
import Footer from "../../../components/Footer/Footer";
import { createJobApi } from "../../../service/job/create_job";
import { getJobDetailApi } from "../../../service/job/job_detail";
import { updateJob } from "../../../service/job/update_job";
import { getJobTypesApi } from "../../../service/job/job_type";
import { getLevelsApi } from "../../../service/level/level";
import { getAllIndustries } from "../../../service/industry/industry";

const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? null : numberValue;
};

const formatDeadlineInput = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length > 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  }

  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return digits;
};

const formatDateToDisplayDate = (date) => {
  if (!date) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatDateFromApi = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return formatDateToDisplayDate(date);
};

const toIsoDateFromDisplayDate = (value) => {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) return null;

  const [, dayValue, monthValue, yearValue] = match;
  const day = Number(dayValue);
  const month = Number(monthValue);
  const year = Number(yearValue);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return `${yearValue}-${monthValue}-${dayValue}`;
};

const parseDisplayDate = (value) => {
  const isoDate = toIsoDateFromDisplayDate(value);

  if (!isoDate) return null;

  const [year, month, day] = isoDate.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const getSubmitErrorMessage = (error, isEditMode = false) => {
  if (typeof error === "string") return error;

  return (
    error?.response?.data?.message ||
    error?.message ||
    error?.error ||
    (isEditMode
      ? "Không thể cập nhật tin tuyển dụng."
      : "Không thể tạo tin tuyển dụng.")
  );
};

export default function CreateJob() {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [collapsed, setCollapsed] = useState(false);
  const [step, setStep] = useState(1);

  const [industries, setIndustries] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [levels, setLevels] = useState([]);

  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const industryRef = useRef(null);
  const jobTypeRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    level: "",
    quantity: "",
    industryIds: [],
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    description: "",
    requirement: "",
    location: "",
    benefit: "",
    workingType: "",
    deadline: "",
  });

  const selectedIndustryIds = formData.industryIds.map(Number);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingData(true);
        setSubmitError("");
        setSubmitSuccess("");

        const requests = [
          getJobTypesApi(),
          getAllIndustries(),
          getLevelsApi(),
        ];

        if (isEditMode) {
          requests.push(getJobDetailApi(id));
        }

        const [
          jobTypeResponse,
          industryResponse,
          levelResponse,
          jobDetailResponse,
        ] = await Promise.all(requests);

        setJobTypes(jobTypeResponse?.data?.jobTypes || []);
        setLevels(levelResponse?.data?.levels || []);

        setIndustries(
          industryResponse?.data?.industries ||
            industryResponse?.data ||
            []
        );

        if (isEditMode) {
          const job = jobDetailResponse?.data?.job || jobDetailResponse?.data;

          if (!job) {
            setSubmitError("Không tìm thấy tin tuyển dụng.");
            return;
          }

          setFormData({
            title: job.name || "",
            level: job.id_level ? String(job.id_level) : "",
            quantity: job.candidate_number ?? "",
            industryIds: Array.isArray(job.industries)
              ? job.industries.map((item) => Number(item.id))
              : [],
            minExperience: job.exp_min ?? "",
            maxExperience: job.exp_max ?? "",
            minSalary: job.salary_min ?? "",
            maxSalary: job.salary_max ?? "",
            description: job.description || "",
            requirement: job.job_requirement || "",
            location: job.location || "",
            benefit: job.job_benefit || "",
            workingType: job.job_type_id ? String(job.job_type_id) : "",
            deadline: formatDateFromApi(job.expire),
          });
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu ban đầu:", error);
        setSubmitError(
          isEditMode
            ? "Không thể tải thông tin tin tuyển dụng."
            : "Không thể tải danh sách lĩnh vực, cấp độ hoặc hình thức làm việc."
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchInitialData();
  }, [id, isEditMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        industryRef.current &&
        !industryRef.current.contains(event.target)
      ) {
        setShowIndustryDropdown(false);
      }

      if (
        jobTypeRef.current &&
        !jobTypeRef.current.contains(event.target)
      ) {
        setShowJobTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "deadline" ? formatDeadlineInput(value) : value,
    }));
  };

  const handleToggleIndustry = (industryId) => {
    const currentId = Number(industryId);

    setFormData((prev) => {
      const prevIds = prev.industryIds.map(Number);
      const selected = prevIds.includes(currentId);

      return {
        ...prev,
        industryIds: selected
          ? prevIds.filter((item) => item !== currentId)
          : [...prevIds, currentId],
      };
    });
  };

  const removeIndustry = (industryId) => {
    const currentId = Number(industryId);

    setFormData((prev) => ({
      ...prev,
      industryIds: prev.industryIds
        .map(Number)
        .filter((item) => item !== currentId),
    }));
  };

  const selectedIndustries = industries.filter((industry) =>
    selectedIndustryIds.includes(Number(industry.id))
  );

  const selectedJobType = jobTypes.find(
    (item) => String(item.id) === String(formData.workingType)
  );

  const validateStepOne = () => {
    if (!formData.title.trim()) {
      setSubmitError("Vui lòng nhập vị trí tuyển dụng.");
      return false;
    }

    if (!formData.level) {
      setSubmitError("Vui lòng chọn cấp độ.");
      return false;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setSubmitError("Vui lòng nhập số lượng hợp lệ.");
      return false;
    }

    if (formData.industryIds.length === 0) {
      setSubmitError("Vui lòng chọn lĩnh vực.");
      return false;
    }

    if (!formData.location.trim()) {
      setSubmitError("Vui lòng nhập địa điểm.");
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    setSubmitError("");
    setSubmitSuccess("");

    if (!validateStepOne()) return;

    setStep(2);
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitError("");
    setSubmitSuccess("");

    if (!validateStepOne()) {
      setStep(1);
      return;
    }

    if (!formData.deadline) {
      setSubmitError("Vui lòng chọn hạn nộp hồ sơ.");
      return;
    }

    const expire = toIsoDateFromDisplayDate(formData.deadline);

    if (!expire) {
      setSubmitError("Hạn nộp hồ sơ phải đúng định dạng dd/mm/yyyy.");
      return;
    }

    if (!formData.workingType) {
      setSubmitError("Vui lòng chọn hình thức làm việc.");
      return;
    }

    const payload = {
      name: formData.title.trim(),
      industryIds: formData.industryIds.map(Number),
      candidateNumber: toNumberOrNull(formData.quantity),
      expMin: toNumberOrNull(formData.minExperience),
      expMax: toNumberOrNull(formData.maxExperience),
      salaryMin: toNumberOrNull(formData.minSalary),
      salaryMax: toNumberOrNull(formData.maxSalary),
      description: formData.description.trim() || null,
      jobRequirement: formData.requirement.trim() || null,
      location: formData.location.trim() || null,
      jobBenefit: formData.benefit.trim() || null,
      expire,
      levelId: toNumberOrNull(formData.level),
      jobTypeId: toNumberOrNull(formData.workingType),
    };

    try {
      setSubmitting(true);

      const response = isEditMode
        ? await updateJob(id, payload)
        : await createJobApi(payload);

      setSubmitSuccess(
        response?.message ||
          (isEditMode
            ? "Cập nhật tin tuyển dụng thành công."
            : "Đăng bài thành công.")
      );
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error, isEditMode));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="createjob-layout">
        <MenuCard collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="createjob-wrapper">
          <div className="createjob-card">
            <h2 className="createjob-main-title">
              {isEditMode
                ? "Chỉnh sửa tin tuyển dụng"
                : "Tạo tin tuyển dụng mới"}
            </h2>

            <div className="createjob-steps-container">
              <div
                className={`createjob-step-item ${
                  step === 1 ? "active" : "completed"
                }`}
              >
                <span className="createjob-step-number">Ⅰ</span>
                <span>Thông tin tuyển dụng</span>
              </div>

              <div
                className={`createjob-step-divider ${
                  step === 2 ? "active" : ""
                }`}
              ></div>

              <div
                className={`createjob-step-item ${
                  step === 2 ? "active" : ""
                }`}
              >
                <span className="createjob-step-number">Ⅱ</span>
                <span>
                  {isEditMode
                    ? "Quyền lợi, thời gian & Lưu thay đổi"
                    : "Quyền lợi, thời gian & Đăng bài"}
                </span>
              </div>
            </div>

            {loadingData && (
              <p className="createjob-submit-message">Đang tải dữ liệu...</p>
            )}

            {step === 1 ? (
              <>
                <h3 className="createjob-section-title">
                  1. Thông tin công việc
                </h3>

                <div className="createjob-form-grid">
                  <div className="createjob-form-group">
                    <label>Vị trí tuyển dụng *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="createjob-input"
                      placeholder="Vị trí tuyển dụng"
                    />
                  </div>

                  <div className="createjob-form-group">
                    <label>Cấp độ *</label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="createjob-input"
                    >
                      <option value="">Chọn cấp độ</option>
                      {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="createjob-form-group">
                    <label>Số lượng *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="createjob-input"
                      placeholder="Số lượng"
                    />
                  </div>

                  <div className="createjob-form-group industry-box">
                    <label>Lĩnh vực *</label>

                    <div className="industry-select-wrapper" ref={industryRef}>
                      <div
                        className={`industry-select ${
                          showIndustryDropdown ? "active" : ""
                        }`}
                        onClick={() =>
                          setShowIndustryDropdown((prev) => !prev)
                        }
                      >
                        <div className="industry-selected-list">
                          {selectedIndustries.length === 0 ? (
                            <span className="industry-placeholder">
                              {loadingData ? "Đang tải..." : "Chọn..."}
                            </span>
                          ) : (
                            selectedIndustries.map((industry) => (
                              <span className="industry-tag" key={industry.id}>
                                {industry.name}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeIndustry(industry.id);
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>

                        <ChevronDown
                          className="industry-arrow"
                          size={20}
                          strokeWidth={2}
                        />
                      </div>

                      {showIndustryDropdown && (
                        <div className="industry-dropdown">
                          {industries.length === 0 ? (
                            <div className="industry-option">
                              Không có lĩnh vực
                            </div>
                          ) : (
                            industries.map((industry) => {
                              const isChecked = selectedIndustryIds.includes(
                                Number(industry.id)
                              );

                              return (
                                <div
                                  key={industry.id}
                                  className={`industry-option ${
                                    isChecked ? "selected" : ""
                                  }`}
                                  onClick={() =>
                                    handleToggleIndustry(industry.id)
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                  />
                                  <span>{industry.name}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="createjob-form-group experience-box">
                    <label>Kinh nghiệm</label>

                    <div className="experience-flex">
                      <input
                        type="number"
                        min="0"
                        name="minExperience"
                        value={formData.minExperience}
                        onChange={handleChange}
                        className="createjob-input"
                        placeholder="Tối thiểu"
                      />

                      <span>-</span>

                      <input
                        type="number"
                        min="0"
                        name="maxExperience"
                        value={formData.maxExperience}
                        onChange={handleChange}
                        className="createjob-input"
                        placeholder="Tối đa"
                      />
                    </div>
                  </div>

                  <div className="createjob-form-group salary-box">
                    <label>Mức lương</label>

                    <div className="salary-flex">
                      <input
                        type="number"
                        name="minSalary"
                        value={formData.minSalary}
                        onChange={handleChange}
                        className="createjob-input"
                        placeholder="Từ"
                      />

                      <span>-</span>

                      <input
                        type="number"
                        name="maxSalary"
                        value={formData.maxSalary}
                        onChange={handleChange}
                        className="createjob-input"
                        placeholder="Đến"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="createjob-section-title">
                  2. Mô tả công việc
                </h3>

                <div className="createjob-form-grid-two">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="createjob-textarea"
                    placeholder="Mô tả công việc"
                  ></textarea>

                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleChange}
                    className="createjob-textarea"
                    placeholder="Yêu cầu ứng viên"
                  ></textarea>
                </div>

                <h3 className="createjob-section-title">3. Địa điểm *</h3>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="createjob-input"
                  placeholder="Địa điểm"
                />

                {submitError && (
                  <p className="createjob-submit-message error">
                    {submitError}
                  </p>
                )}

                {submitSuccess && (
                  <p className="createjob-submit-message success">
                    {submitSuccess}
                  </p>
                )}

                <div className="footer-btn">
                  <button
                    className="btn-primary"
                    onClick={handleNextStep}
                    disabled={loadingData}
                  >
                    Tiếp tục
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="createjob-section-title">
                  1. Quyền lợi ứng viên
                </h3>

                <textarea
                  name="benefit"
                  value={formData.benefit}
                  onChange={handleChange}
                  className="createjob-textarea-large"
                  placeholder="Quyền lợi ứng viên"
                ></textarea>

                <h3 className="createjob-section-title">
                  2. Hình thức làm việc
                </h3>

                <div className="createjob-jobtype-wrapper" ref={jobTypeRef}>
                  <button
                    type="button"
                    className={`createjob-jobtype-select ${
                      showJobTypeDropdown ? "active" : ""
                    } ${!selectedJobType ? "placeholder" : ""}`}
                    onClick={() =>
                      setShowJobTypeDropdown((prev) => !prev)
                    }
                    disabled={loadingData}
                  >
                    <span>
                      {selectedJobType?.name || "Chọn hình thức làm việc"}
                    </span>
                    <span className="createjob-jobtype-arrow">⌄</span>
                  </button>

                  {showJobTypeDropdown && (
                    <div className="createjob-jobtype-dropdown">
                      <button
                        type="button"
                        className={`createjob-jobtype-option ${
                          !formData.workingType ? "selected" : ""
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            workingType: "",
                          }));
                          setShowJobTypeDropdown(false);
                        }}
                      >
                        Chọn hình thức làm việc
                      </button>

                      {jobTypes.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={`createjob-jobtype-option ${
                            String(formData.workingType) === String(item.id)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              workingType: String(item.id),
                            }));
                            setShowJobTypeDropdown(false);
                          }}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="createjob-section-title">3. Hạn nộp hồ sơ</h3>

                <DatePicker
                  selected={parseDisplayDate(formData.deadline)}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      deadline: formatDateToDisplayDate(date),
                    }))
                  }
                  onChangeRaw={(event) => {
                    const value = event?.target?.value || "";

                    setFormData((prev) => ({
                      ...prev,
                      deadline: formatDeadlineInput(value),
                    }));
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/yyyy"
                  className="createjob-input"
                  wrapperClassName="createjob-date-picker-wrapper"
                  inputMode="numeric"
                  maxDate={new Date(9999, 11, 31)}
                  popperPlacement="bottom-start"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />

                {submitError && (
                  <p className="createjob-submit-message error">
                    {submitError}
                  </p>
                )}

                {submitSuccess && (
                  <p className="createjob-submit-message success">
                    {submitSuccess}
                  </p>
                )}

                <div className="footer-btn">
                  <button className="btn-outline" onClick={() => setStep(1)}>
                    Quay lại
                  </button>

                  <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={submitting || loadingData}
                  >
                    {submitting
                      ? isEditMode
                        ? "Đang lưu..."
                        : "Đang đăng bài..."
                      : isEditMode
                        ? "Lưu"
                        : "Đăng bài"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
