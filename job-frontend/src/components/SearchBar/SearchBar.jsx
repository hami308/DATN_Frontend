import { useEffect, useState } from "react";

import styles from "./searchBar.module.css";

import { getAllIndustries } from "../../service/industry/industry";

export default function SearchBar({ onSearch }) {
  const [role, setRole] = useState("");

  const [industries, setIndustries] = useState([]);

  const [industryLoading, setIndustryLoading] = useState(false);

  const [industryId, setIndustryId] = useState("");

  const [keyword, setKeyword] = useState("");

  const [status, setStatus] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role) {
      setRole(user.role);
    }
  }, []);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setIndustryLoading(true);

        const response = await getAllIndustries();

        setIndustries(response.data.industries);
      } catch (error) {
        console.error(error);
      } finally {
        setIndustryLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch?.({
      name: keyword.trim(),
      industryId,
    });
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.searchBar} onSubmit={handleSubmit}>
        <select
          className={styles.select}
          value={industryId}
          onChange={(event) => setIndustryId(event.target.value)}
          disabled={industryLoading}
        >
          <option value="">
            {industryLoading ? "Đang tải danh mục..." : "Danh mục nghề"}
          </option>

          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>

        <div className={styles.inputBox}>
          <div className={styles.icon}>
            <span className="material-symbols-outlined">search</span>
          </div>

          <input
            placeholder="Vị trí tuyển dụng , địa điểm , tên công ty..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        {role !== "candidate" && (
          <select
            className={styles.select}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Tất cả trạng thái</option>

            <option value="1">Đang mở</option>

            <option value="2">Đã hết hạn</option>

            <option value="0">Đã đóng</option>
          </select>
        )}

        <button className={styles.btn} type="submit">
          Tìm kiếm
        </button>
      </form>
    </div>
  );
}
