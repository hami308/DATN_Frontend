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
} from "lucide-react";
import styles from "./CompanyVerification.module.css";
import {
  approvePendingCompany,
  getAllPendingCompanies,
} from "../../../../service/comapny/pending_company";

const getCompanyId = (company) =>
  company?.id || company?.pending_company_id || company?.company_id;

const getCertificateUrl = (company) =>
  company?.certificate ||
  company?.certificate_url ||
  company?.business_certificate ||
  company?.business_paper ||
  "";

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

export default function CompanyVerification() {
  const [companies, setCompanies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

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

    if (!keyword) return companies;

    return companies.filter((company) => {
      const haystack = [
        company?.name,
        company?.tax_code,
        company?.taxCode,
        company?.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [companies, search]);

  const selectedCompany =
    filteredCompanies.find((company) => getCompanyId(company) === selectedId) ||
    filteredCompanies[0] ||
    null;

  const selectedIndustries = getIndustries(selectedCompany);
  const certificateUrl = getCertificateUrl(selectedCompany);
  const isCertificatePdf = certificateUrl.toLowerCase().includes(".pdf");
  const status = selectedCompany?.status || "pending";
  const canConfirm = selectedCompany && status !== "approved";

  const statusLabel = {
    pending: "Chờ xác nhận",
    approved: "Đã xác nhận",
    rejected: "Đã từ chối",
  }[status] || "Chờ xác nhận";

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

  const renderCertificate = () => {
    if (!certificateUrl) {
      return (
        <div className={styles.emptyPaper}>
          <FileText size={34} />
          <p>Chưa có giấy xác nhận doanh nghiệp</p>
        </div>
      );
    }

    if (isCertificatePdf) {
      return (
        <iframe
          src={certificateUrl}
          title="Giấy xác nhận doanh nghiệp"
          className={styles.paperFrame}
        />
      );
    }

    return (
      <img
        src={certificateUrl}
        alt="Giấy xác nhận doanh nghiệp"
        className={styles.paperImage}
      />
    );
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
                  {selectedCompany?.logo ? (
                    <img src={selectedCompany.logo} alt="Logo công ty" />
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

              <div className={styles.paperSection}>
                <div className={styles.sectionTitle}>
                  <div>
                    <h4>Giấy xác nhận doanh nghiệp</h4>
                    <p>Admin kiểm tra giấy tờ trước khi xác nhận thông tin.</p>
                  </div>

                  {certificateUrl && (
                    <a
                      href={certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.openPaper}
                    >
                      <ExternalLink size={16} />
                      Mở file
                    </a>
                  )}
                </div>

                <div className={styles.paperPreview}>{renderCertificate()}</div>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={handleConfirm}
                  disabled={!canConfirm || confirming}
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
