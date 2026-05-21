import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  MapPin,
  Search,
  Share2,
  ShieldCheck,
  Tag,
  UserRound,
  XCircle,
} from "lucide-react";
import styles from "./CompanyVerification.module.css";
import {
  approvePendingCompany,
  getAllPendingCompanies,
  rejectPendingCompany,
} from "../../../../service/comapny/pending_company";
import { getCompanyDetailById } from "../../../../service/comapny/company_infor";
import { BASE_URL } from "../../../../service/api";

const getCompanyId = (company) =>
  company?.id || company?.pending_company_id || company?.company_id;

const getApprovedCompanyId = (company) =>
  company?.company_id ||
  company?.companyId ||
  company?.approved_company_id ||
  company?.approvedCompanyId ||
  company?.company?.company_id ||
  company?.company?.id;

const getCertificateUrl = (company) =>
  getPublicAssetUrl(
    company?.certificate ||
      company?.certificate_url ||
      company?.business_certificate ||
      company?.business_paper ||
      ""
  );

const isBlobUrl = (value) => typeof value === "string" && value.startsWith("blob:");
const getPublicAssetUrl = (value) => {
  if (!value || typeof value !== "string" || isBlobUrl(value)) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${BASE_URL.replace("/api", "")}${value}`;
  return value;
};
const getImageUrl = (value) => getPublicAssetUrl(value);
const isPdfUrl = (value) => getPublicAssetUrl(value).toLowerCase().includes(".pdf");

const getIndustries = (company) => {
  const industries = company?.industries || company?.industry || [];

  if (Array.isArray(industries)) {
    return industries
      .map((item) => (typeof item === "string" ? item : item?.name))
      .filter(Boolean);
  }

  return String(industries)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatValue = (value) => value || "Chưa cập nhật";

const getRequestType = (company) => {
  const type = String(
    company?.request_type ||
      company?.requestType ||
      company?.action ||
      company?.type ||
      ""
  ).toLowerCase();

  if (["update", "edit", "change"].includes(type)) return "update";
  if (["create", "new"].includes(type)) return "create";
  return getApprovedCompanyId(company) ? "update" : "create";
};

const getCurrentCompanyFromRequest = (company) =>
  company?.company ||
  company?.current_company ||
  company?.currentCompany ||
  company?.original_company ||
  company?.originalCompany ||
  company?.existing_company ||
  company?.existingCompany ||
  company?.saved_company ||
  company?.savedCompany ||
  null;

const getRequester = (company) =>
  company?.recruiter ||
  company?.requested_by ||
  company?.requestedBy ||
  company?.requester ||
  company?.created_by ||
  company?.createdBy ||
  company?.user ||
  null;

const getRequesterName = (company) => {
  const requester = getRequester(company);

  return (
    requester?.full_name ||
    requester?.name ||
    requester?.email ||
    company?.recruiter_name ||
    company?.requester_name ||
    company?.created_by_name ||
    "Chưa có thông tin"
  );
};

const getRequesterContact = (company) => {
  const requester = getRequester(company);

  return (
    requester?.email ||
    requester?.phone ||
    company?.recruiter_email ||
    company?.requester_email ||
    company?.recruiter_phone ||
    ""
  );
};

const companyFields = [
  {
    key: "logo",
    label: "Logo",
    getValue: (company) => (getImageUrl(company?.logo) ? "Đã cập nhật logo" : ""),
  },
  { key: "name", label: "Tên công ty", getValue: (company) => company?.name },
  {
    key: "tax_code",
    label: "Mã số thuế",
    getValue: (company) => company?.tax_code || company?.taxCode,
  },
  {
    key: "industries",
    label: "Lĩnh vực hoạt động",
    getValue: (company) => {
      const industries = getIndustries(company);
      return industries.length > 0 ? industries.join(", ") : "";
    },
  },
  {
    key: "url_website",
    label: "Website",
    getValue: (company) => company?.url_website || company?.website,
  },
  {
    key: "url_facebook",
    label: "Facebook",
    getValue: (company) => company?.url_facebook || company?.facebook,
  },
  { key: "location", label: "Địa chỉ", getValue: (company) => company?.location },
  { key: "description", label: "Mô tả", getValue: (company) => company?.description },
];

export default function CompanyVerification() {
  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");
  const [currentCompanies, setCurrentCompanies] = useState({});
  const [currentCompanyLoading, setCurrentCompanyLoading] = useState(false);

  const fetchPendingCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPendingCompanies();
      const data =
        response?.pendingCompanies ||
        response?.data?.pendingCompanies ||
        response?.data ||
        response ||
        [];

      const list = Array.isArray(data) ? data : [];

      setCompanies(list);
      setSelectedId((currentId) => currentId || getCompanyId(list[0]) || null);
    } catch (err) {
      console.error("Lỗi lấy danh sách công ty chờ xác nhận:", err);
      setError("Không thể tải danh sách công ty chờ xác nhận.");
      setCompanies([]);
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return companies.filter((company) => {
      const status = company?.status || "pending";

      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      if (!keyword) return true;

      const haystack = [
        company?.name,
        company?.tax_code,
        company?.taxCode,
        company?.location,
        getRequesterName(company),
        getRequesterContact(company),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [companies, search, statusFilter]);

  const selectedCompany =
    filteredCompanies.find((company) => getCompanyId(company) === selectedId) ||
    filteredCompanies[0] ||
    null;

  const requestType = getRequestType(selectedCompany);
  const isUpdateRequest = requestType === "update";
  const approvedCompanyId = getApprovedCompanyId(selectedCompany);
  const currentCompany =
    getCurrentCompanyFromRequest(selectedCompany) ||
    currentCompanies[approvedCompanyId] ||
    null;

  const selectedIndustries = getIndustries(selectedCompany);
  const pendingLogoUrl = getImageUrl(selectedCompany?.logo);
  const currentLogoUrl = getImageUrl(currentCompany?.logo);
  const pendingCertificateUrl = getCertificateUrl(selectedCompany);
  const currentCertificateUrl = getCertificateUrl(currentCompany);
  const status = selectedCompany?.status || "pending";
  const canConfirm = selectedCompany && status === "pending";
  const canReject = selectedCompany && status === "pending";

  const statusLabel = {
    pending: "Chờ xác nhận",
    approved: "Đã xác nhận",
    rejected: "Đã từ chối",
  }[status] || "Chờ xác nhận";

  useEffect(() => {
    setRejectReason(
      selectedCompany?.reject_reason ||
        selectedCompany?.rejectReason ||
        selectedCompany?.reason ||
        ""
    );
  }, [selectedCompany]);

  useEffect(() => {
    const fetchCurrentCompany = async () => {
      if (!isUpdateRequest || !approvedCompanyId || currentCompany) return;

      try {
        setCurrentCompanyLoading(true);

        const response = await getCompanyDetailById(approvedCompanyId);
        const company =
          response?.company ||
          response?.data?.company ||
          response?.data ||
          response;

        setCurrentCompanies((prev) => ({
          ...prev,
          [approvedCompanyId]: company,
        }));
      } catch (err) {
        console.error("Lỗi lấy thông tin công ty đã lưu:", err);
      } finally {
        setCurrentCompanyLoading(false);
      }
    };

    fetchCurrentCompany();
  }, [approvedCompanyId, currentCompany, isUpdateRequest]);

  const handleConfirm = async () => {
    if (!selectedCompany) return;

    const companyId = getCompanyId(selectedCompany);

    try {
      setConfirming(true);

      await approvePendingCompany(companyId);

      setCompanies((currentCompanies) =>
        currentCompanies.map((company) =>
          getCompanyId(company) === companyId
            ? { ...company, status: "approved" }
            : company
        )
      );

      alert("Đã xác nhận thông tin công ty.");
    } catch (err) {
      console.error("Lỗi xác nhận thông tin công ty:", err);
      alert(err?.message || "Xác nhận thông tin công ty thất bại.");
    } finally {
      setConfirming(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCompany) return;

    const companyId = getCompanyId(selectedCompany);
    const reason = rejectReason.trim();

    if (!reason) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }

    try {
      setRejecting(true);

      const response = await rejectPendingCompany(companyId, {
        rejectReason: reason,
      });
      const rejectedCompany =
        response?.pendingCompany ||
        response?.data?.pendingCompany ||
        response?.data ||
        null;

      setCompanies((currentCompanies) =>
        currentCompanies.map((company) =>
          getCompanyId(company) === companyId
            ? {
                ...company,
                ...(rejectedCompany || {}),
                status: "rejected",
                reject_reason: reason,
              }
            : company
        )
      );

      alert(response?.message || "Đã từ chối yêu cầu công ty.");
    } catch (err) {
      console.error("Lỗi từ chối yêu cầu công ty:", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Từ chối yêu cầu công ty thất bại."
      );
    } finally {
      setRejecting(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Quản trị doanh nghiệp</p>
          <h2>Xác nhận thông tin công ty</h2>
        </div>

        <div className={styles.summary}>
          <ShieldCheck size={20} />
          <span>{companies.length} hồ sơ</span>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.layout}>
        <aside className={styles.listPanel}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tên, mã số thuế"
            />
          </div>

          <div className={styles.filterBox}>
            <label htmlFor="company-status-filter">Trạng thái</label>
            <select
              id="company-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="approved">Đã xác nhận</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>

          <div className={styles.companyList}>
            {loading ? (
              <div className={styles.loading}>
                <Loader2 size={20} />
                <span>Đang tải hồ sơ...</span>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className={styles.emptyList}>Không có hồ sơ phù hợp</div>
            ) : (
              filteredCompanies.map((company) => {
                const companyId = getCompanyId(company);
                const active = companyId === getCompanyId(selectedCompany);

                return (
                  <button
                    key={companyId}
                    type="button"
                    className={`${styles.companyItem} ${
                      active ? styles.activeCompany : ""
                    }`}
                    onClick={() => setSelectedId(companyId)}
                  >
                    <span className={styles.companyIcon}>
                      <Building2 size={18} />
                    </span>

                    <span className={styles.companyItemText}>
                      <strong>{formatValue(company?.name)}</strong>
                      <small>
                        MST: {formatValue(company?.tax_code || company?.taxCode)}
                      </small>
                      <small>
                        {getRequestType(company) === "update"
                          ? "Yêu cầu cập nhật"
                          : "Yêu cầu tạo mới"}{" "}
                        · {getRequesterName(company)}
                      </small>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className={styles.detailPanel}>
          {!selectedCompany ? (
            <div className={styles.emptyDetail}>
              <Building2 size={42} />
              <p>Chọn một hồ sơ để xem thông tin xác nhận</p>
            </div>
          ) : (
            <>
              <div className={styles.companyHeader}>
                <div className={styles.logoBox}>
                  {pendingLogoUrl ? (
                    <img src={pendingLogoUrl} alt="Logo công ty" />
                  ) : (
                    <Building2 size={28} />
                  )}
                </div>

                <div className={styles.companyTitle}>
                  <div className={styles.titleRow}>
                    <h3>{formatValue(selectedCompany?.name)}</h3>
                    <span className={`${styles.status} ${styles[status]}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <p>Mã số thuế: {formatValue(selectedCompany?.tax_code || selectedCompany?.taxCode)}</p>
                </div>
              </div>

              <RequestInfo company={selectedCompany} requestType={requestType} />

              {isUpdateRequest ? (
                <CompanyComparison
                  currentCompany={currentCompany}
                  pendingCompany={selectedCompany}
                  loading={currentCompanyLoading}
                />
              ) : (
                <>
                  <div className={styles.infoGrid}>
                    <InfoItem
                      icon={<MapPin size={18} />}
                      label="Địa chỉ"
                      value={formatValue(selectedCompany?.location)}
                    />
                    <InfoItem
                      icon={<Tag size={18} />}
                      label="Lĩnh vực hoạt động"
                      value={
                        selectedIndustries.length > 0
                          ? selectedIndustries.join(", ")
                          : "Chưa cập nhật"
                      }
                    />
                    <InfoLink
                      icon={<Globe size={18} />}
                      label="Website"
                      value={selectedCompany?.url_website || selectedCompany?.website}
                    />
                    <InfoLink
                      icon={<Share2 size={18} />}
                      label="Facebook"
                      value={selectedCompany?.url_facebook || selectedCompany?.facebook}
                    />
                  </div>

                  <div className={styles.description}>
                    <h4>Mô tả công ty</h4>
                    <p>{formatValue(selectedCompany?.description)}</p>
                  </div>
                </>
              )}

              <ReviewFiles
                isUpdateRequest={isUpdateRequest}
                currentLogoUrl={currentLogoUrl}
                pendingLogoUrl={pendingLogoUrl}
                currentCertificateUrl={currentCertificateUrl}
                pendingCertificateUrl={pendingCertificateUrl}
              />

              {(status === "pending" || status === "rejected") && (
                <div className={styles.rejectBox}>
                  <label htmlFor="company-reject-reason">Lý do từ chối</label>
                  <textarea
                    id="company-reject-reason"
                    value={rejectReason}
                    onChange={(event) => setRejectReason(event.target.value)}
                    readOnly={status !== "pending"}
                    placeholder="Nhập lý do nếu từ chối giấy xác nhận hoặc thông tin công ty"
                  />
                </div>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.rejectBtn}
                  onClick={handleReject}
                  disabled={!canReject || rejecting || confirming}
                >
                  {rejecting ? (
                    <Loader2 size={18} className={styles.spinIcon} />
                  ) : (
                    <XCircle size={18} />
                  )}
                  {status === "rejected" ? "Đã từ chối" : "Từ chối"}
                </button>

                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={handleConfirm}
                  disabled={!canConfirm || confirming || rejecting}
                >
                  {confirming ? (
                    <Loader2 size={18} className={styles.spinIcon} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  {status === "approved"
                    ? "Thông tin đã được xác nhận"
                    : "Xác nhận thông tin"}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}

function ReviewFiles({
  isUpdateRequest,
  currentCertificateUrl,
  pendingCertificateUrl,
}) {
  return (
    <div className={styles.reviewFilesSection}>
      <div className={styles.sectionTitle}>
        <div>
          <h4>Tệp xác minh</h4>
          <p>Kiểm tra giấy xác nhận trước khi duyệt yêu cầu.</p>
        </div>
      </div>

      <FilePair
        title="Giấy xác nhận doanh nghiệp"
        type="certificate"
        isUpdateRequest={isUpdateRequest}
        currentUrl={currentCertificateUrl}
        pendingUrl={pendingCertificateUrl}
      />
    </div>
  );
}

function FilePair({ title, type, isUpdateRequest, currentUrl, pendingUrl }) {
  return (
    <div className={styles.filePair}>
      <h5>{title}</h5>

      <div
        className={`${styles.filePairGrid} ${
          isUpdateRequest ? styles.filePairGridTwo : ""
        }`}
      >
        {isUpdateRequest && (
          <FilePreviewCard
            label="Nội dung đã lưu"
            type={type}
            url={currentUrl}
          />
        )}

        <FilePreviewCard
          label={isUpdateRequest ? "Nội dung cập nhật" : "Nội dung gửi duyệt"}
          type={type}
          url={pendingUrl}
        />
      </div>
    </div>
  );
}

function FilePreviewCard({ label, type, url }) {
  const isLogo = type === "logo";

  return (
    <div className={styles.filePreviewCard}>
      <div className={styles.filePreviewHeader}>
        <span>{label}</span>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={styles.openPaper}
          >
            <ExternalLink size={15} />
            Mở file
          </a>
        )}
      </div>

      <div
        className={`${styles.filePreviewBody} ${
          isLogo ? styles.logoPreviewBody : styles.certificatePreviewBody
        }`}
      >
        {!url ? (
          <div className={styles.emptyPaper}>
            {isLogo ? <Building2 size={30} /> : <FileText size={34} />}
            <p>Chưa có tệp</p>
          </div>
        ) : isLogo ? (
          <img src={url} alt="Logo công ty" className={styles.logoPreviewImage} />
        ) : isPdfUrl(url) ? (
          <iframe
            src={url}
            title={label}
            className={styles.paperFrame}
          />
        ) : (
          <img
            src={url}
            alt={label}
            className={styles.paperImage}
          />
        )}
      </div>
    </div>
  );
}

function RequestInfo({ company, requestType }) {
  const contact = getRequesterContact(company);
  const requestedAt = company?.updated_at || company?.created_at || company?.createdAt;

  return (
    <div className={styles.requestInfo}>
      <div className={styles.requestInfoItem}>
        <span className={styles.requestInfoIcon}>
          <UserRound size={18} />
        </span>
        <div>
          <span>Người yêu cầu</span>
          <strong>{getRequesterName(company)}</strong>
          {contact && <small>{contact}</small>}
        </div>
      </div>

      <div className={styles.requestInfoItem}>
        <span className={styles.requestBadge}>
          {requestType === "update" ? "Yêu cầu cập nhật" : "Yêu cầu tạo mới"}
        </span>
        {requestedAt && <small>{formatDateTime(requestedAt)}</small>}
      </div>
    </div>
  );
}

function CompanyComparison({ currentCompany, pendingCompany, loading }) {
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = (key) => {
    setExpandedDescriptions((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <div className={styles.compareSection}>
      <div className={styles.sectionTitle}>
        <div>
          <h4>Nội dung thay đổi</h4>
          <p>So sánh thông tin đang lưu với nội dung nhà tuyển dụng yêu cầu cập nhật.</p>
        </div>
      </div>

      {loading && !currentCompany ? (
        <div className={styles.compareLoading}>
          <Loader2 size={18} className={styles.spinIcon} />
          <span>Đang tải nội dung đã lưu...</span>
        </div>
      ) : (
        <div className={styles.compareTable}>
          <div className={styles.compareHead}>Trường thông tin</div>
          <div className={styles.compareHead}>Nội dung đã lưu</div>
          <div className={styles.compareHead}>Nội dung cập nhật</div>

          {companyFields.map((field) => {
            const currentValue = formatValue(field.getValue(currentCompany));
            const pendingValue = formatValue(field.getValue(pendingCompany));
            const changed = currentValue !== pendingValue;
            const isDescription = field.key === "description";

            return (
              <div className={styles.compareRow} key={field.key}>
                <div className={styles.compareLabel}>{field.label}</div>
                <div className={styles.compareValue}>
                  {isDescription ? (
                    <ExpandableText
                      value={currentValue}
                      expanded={Boolean(expandedDescriptions.current)}
                      onToggle={() => toggleDescription("current")}
                    />
                  ) : (
                    currentValue
                  )}
                </div>
                <div
                  className={`${styles.compareValue} ${
                    changed ? styles.changedValue : ""
                  }`}
                >
                  {isDescription ? (
                    <ExpandableText
                      value={pendingValue}
                      expanded={Boolean(expandedDescriptions.pending)}
                      onToggle={() => toggleDescription("pending")}
                    />
                  ) : (
                    pendingValue
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ExpandableText({ value, expanded, onToggle }) {
  const text = String(value || "");
  const canToggle = text.length > 140;

  return (
    <div className={styles.expandableText}>
      <p className={expanded ? styles.expandableTextOpen : styles.expandableTextClosed}>
        {text}
      </p>

      {canToggle && (
        <button
          type="button"
          className={styles.expandableTextBtn}
          onClick={onToggle}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function InfoItem({ icon, label, value }) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoIcon}>{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function InfoLink({ icon, label, value }) {
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoIcon}>{icon}</span>
      <div>
        <span>{label}</span>
        {value ? (
          <a href={value} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          <strong>Chưa cập nhật</strong>
        )}
      </div>
    </div>
  );
}
