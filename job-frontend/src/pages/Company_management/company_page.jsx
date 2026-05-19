import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AdminSidebar from "../../components/Sidebar_admin/Sidebar";
import CompanyTable from "./CompanyTable/CompanyTable";
import { getAllCompanies } from "../../service/comapny/company_infor";
import styles from "./CompanyPage.module.css";

const getCompaniesFromResponse = (response) => {
  return (
    response?.data?.companies ||
    response?.companies ||
    response?.data ||
    response ||
    []
  );
};

const getCompanyId = (company) => company?.company_id || company?.id;

export default function Company_page() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllCompanies();
        const data = getCompaniesFromResponse(response);
        const list = Array.isArray(data) ? data : [];

        if (!isMounted) return;

        setCompanies(list);
        setSelectedCompany(list[0] || null);
      } catch (err) {
        if (!isMounted) return;

        setCompanies([]);
        setSelectedCompany(null);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Không thể tải danh sách công ty."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCompanies();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCompanies = useMemo(() => {
    const keyword = searchName.trim().toLowerCase();

    if (!keyword) return companies;

    return companies.filter((company) =>
      [
        company?.name,
        company?.company_name,
        company?.tax_code,
        company?.taxCode,
        company?.location,
        company?.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [companies, searchName]);

  useEffect(() => {
    if (!visibleCompanies.length) {
      setSelectedCompany(null);
      return;
    }

    const selectedId = getCompanyId(selectedCompany);
    const selectedStillVisible = visibleCompanies.some(
      (company) => getCompanyId(company) === selectedId
    );

    if (!selectedStillVisible) {
      setSelectedCompany(visibleCompanies[0]);
    }
  }, [selectedCompany, visibleCompanies]);

  return (
    <div className={styles.page}>
      <Header />

      <div className={styles.body}>
        <AdminSidebar />

        <main className={styles.content}>
          <div className={styles.header}>
            <h1>Quản lý công ty</h1>

            <div className={styles.searchBox}>
              <Search size={18} />
              <input
                value={searchName}
                onChange={(event) => setSearchName(event.target.value)}
                placeholder="Tìm theo tên, mã số thuế, địa chỉ..."
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.layout}>
            <section className={styles.tablePanel}>
              <CompanyTable
                companies={visibleCompanies}
                loading={loading}
                selectedCompanyId={getCompanyId(selectedCompany)}
                onViewCompany={setSelectedCompany}
              />
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}