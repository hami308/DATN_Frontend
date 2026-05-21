import { Building2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./CompanyTable.module.css";

const getCompanyId = (company) => company.company_id || company.id;

export default function CompanyTable({
  companies = [],
  loading = false,
  selectedCompanyId,
}) {
  const navigate = useNavigate();

  const normalizedCompanies = companies.map((company) => ({
    id: getCompanyId(company),
    name: company.name || company.company_name || "Chưa cập nhật",
    logo: company.logo || "",
    taxCode: company.tax_code || company.taxCode || "Chưa cập nhật",
    location: company.location || company.address || "Chưa cập nhật",
  }));

  const handleViewCompany = (companyId) => {
    navigate(`/company-detail/${companyId}`);
  };

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Công ty</th>
            <th>Mã số thuế</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className={styles.empty}>
                Đang tải danh sách công ty...
              </td>
            </tr>
          ) : normalizedCompanies.length === 0 ? (
            <tr>
              <td colSpan="4" className={styles.empty}>
                Không tìm thấy công ty phù hợp
              </td>
            </tr>
          ) : (
            normalizedCompanies.map((company) => {
              const isActive =
                String(company.id) === String(selectedCompanyId);

              return (
                <tr
                  key={company.id}
                  className={isActive ? styles.activeRow : ""}
                >
                  <td>
                    <div className={styles.companyInfo}>
                      <div className={styles.logoBox}>
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} />
                        ) : (
                          <Building2 size={20} />
                        )}
                      </div>

                      <div className={styles.companyText}>
                        <span>{company.name}</span>
                        <small>ID: {company.id}</small>
                      </div>
                    </div>
                  </td>

                  <td>{company.taxCode}</td>

                  <td>{company.location}</td>

                  <td>
                    <button
                      type="button"
                      className={styles.viewBtn}
                      onClick={() => handleViewCompany(company.id)}
                    >
                      <Eye size={17} />
                      Xem
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
