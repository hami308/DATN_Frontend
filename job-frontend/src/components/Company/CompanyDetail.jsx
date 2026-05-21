import {
  BadgeInfo,
  Building2,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";
import logoDefault from "../../assets/images/logo.png";
import { BASE_URL } from "../../service/api";
import styles from "./CompanyDetail.module.css";

const fileBaseUrl = BASE_URL.replace("/api", "");

const getCompanyId = (company) => company?.company_id || company?.id;

const getImageUrl = (image) => {
  if (!image) return "";

  const imagePath = String(image).trim();

  if (!imagePath) return "";
  if (
    imagePath.startsWith("http") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads")) {
    return `${fileBaseUrl}${imagePath}`;
  }

  if (imagePath.startsWith("uploads")) {
    return `${fileBaseUrl}/${imagePath}`;
  }

  return imagePath;
};

const handleImageError = (event) => {
  if (event.currentTarget.dataset.fallbackApplied) return;

  event.currentTarget.dataset.fallbackApplied = "true";
  event.currentTarget.src = logoDefault;
};

const getIndustries = (company) => {
  const industries = company?.industries || company?.industry || [];

  if (!Array.isArray(industries)) return [];

  return industries
    .map((industry) => {
      if (typeof industry === "string") return industry;
      return industry?.name || industry?.industry_name || industry?.title;
    })
    .filter(Boolean);
};

const getRecruiters = (company) => {
  const recruiters =
    company?.recruiters ||
    company?.recruiter_list ||
    company?.company_recruiters ||
    company?.members ||
    [];

  if (Array.isArray(recruiters)) return recruiters;
  if (recruiters && typeof recruiters === "object") return [recruiters];

  return [];
};

const getContactRows = (company) => [
  {
    label: "Website",
    value: company?.url_website || company?.website,
    icon: Globe2,
    href: company?.url_website || company?.website,
  },
  {
    label: "Facebook",
    value: company?.url_facebook || company?.facebook,
    icon: ExternalLink,
    href: company?.url_facebook || company?.facebook,
  },
  {
    label: "Địa chỉ",
    value: company?.location || company?.address,
    icon: MapPin,
  },
  {
    label: "Số điện thoại",
    value: company?.phone,
    icon: Phone,
    href: company?.phone ? `tel:${company.phone}` : "",
  },
];

const normalizeUrl = (url) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
};

export default function CompanyDetail({ company }) {
  if (!company) {
    return (
      <section className={styles.empty}>
        <Building2 size={34} />
        <p>Chưa có thông tin công ty để hiển thị.</p>
      </section>
    );
  }

  const companyId = getCompanyId(company);
  const industries = getIndustries(company);
  const recruiters = getRecruiters(company);
  const contactRows = getContactRows(company).filter((row) => row.value);
  const logo = getImageUrl(company.logo || company.logo_url || company.avatar);

  return (
    <div className={styles.companyDetail}>
      <section className={styles.hero}>
        <div className={styles.logoWrap}>
          {logo ? (
            <img
              src={logo}
              alt={company.name || "Company logo"}
              onError={handleImageError}
            />
          ) : (
            <Building2 size={34} />
          )}
        </div>

        <div className={styles.heroInfo}>
          <h1>{company.name || "Chưa cập nhật tên công ty"}</h1>
          <div className={styles.metaList}>
            {company.tax_code || company.taxCode ? (
              <span>
                Mã số thuế: {company.tax_code || company.taxCode}
              </span>
            ) : null}
            {company.location || company.address ? (
              <span>
                <MapPin size={16} />
                {company.location || company.address}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2>Giới thiệu</h2>
          </div>
          <p className={styles.description}>
            {company.description || "Công ty chưa cập nhật phần giới thiệu."}
          </p>

          <div className={styles.tagList}>
            {industries.length > 0 ? (
              industries.map((industry) => <span key={industry}>{industry}</span>)
            ) : (
              <span>Chưa cập nhật ngành nghề</span>
            )}
          </div>
        </section>

        <aside className={styles.contactPanel}>
          <div className={styles.panelHeader}>
            <h2>Liên hệ</h2>
          </div>

          {contactRows.length > 0 ? (
            <div className={styles.contactList}>
              {contactRows.map((row) => {
                const Icon = row.icon;
                const content = (
                  <>
                    <Icon size={18} />
                    <div>
                      <span>{row.label}</span>
                      <strong>{row.value}</strong>
                    </div>
                  </>
                );

                if (row.href) {
                  const href = row.href.startsWith("tel:")
                    ? row.href
                    : normalizeUrl(row.href);
                  return (
                    <a key={row.label} href={href} target="_blank" rel="noreferrer">
                      {content}
                    </a>
                  );
                }

                return <div key={row.label}>{content}</div>;
              })}
            </div>
          ) : (
            <p className={styles.muted}>Công ty chưa cập nhật thông tin liên hệ.</p>
          )}
        </aside>
      </div>

      <section className={styles.recruiterSection}>
        <div className={styles.sectionTitle}>
          <div>
            <h2>Đội ngũ tuyển dụng</h2>
          </div>
          <strong>{recruiters.length}</strong>
        </div>

        {recruiters.length > 0 ? (
          <div className={styles.recruiterGrid}>
            {recruiters.map((recruiter, index) => {
              const recruiterId = recruiter.id || recruiter.recruiter_id;
              const avatar = getImageUrl(recruiter.avatar || recruiter.avatar_url);

              return (
                <article
                  className={styles.recruiterCard}
                  key={recruiterId || `${companyId}-${index}`}
                >
                  <div className={styles.avatar}>
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={recruiter.full_name || "Recruiter"}
                        onError={handleImageError}
                      />
                    ) : (
                      <UserRound size={24} />
                    )}
                  </div>
                  <div className={styles.recruiterInfo}>
                    <h3>
                      {recruiter.full_name ||
                        recruiter.name ||
                        recruiter.email ||
                        "Recruiter"}
                    </h3>
                    <div className={styles.recruiterContacts}>
                      {recruiter.email ? (
                        <span>
                          <Mail size={14} />
                          {recruiter.email}
                        </span>
                      ) : null}
                      {recruiter.phone ? (
                        <span>
                          <Phone size={14} />
                          {recruiter.phone}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyRecruiter}>
            <UsersRound size={28} />
            <div>
              <h3>Chưa có recruiter</h3>
              <p>Công ty chưa có nhân sự tuyển dụng được hiển thị.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
