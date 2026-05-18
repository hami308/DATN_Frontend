import { useState } from "react";
import styles from "./searchBar.module.css";

export default function SearchBar({
  industries = [],
  industryLoading = false,
  onSearch,
}) {
  const role = "recuiter";
  const [industryId, setIndustryId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    onSearch?.({
      name: keyword.trim(),
      industryId,
      status,
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
            placeholder="Vị trí tuyển dụng"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        {role === "candidate" ? (
          <select className={styles.select}>
            <option>Địa điểm</option>
            <option>Hà Nội</option>
            <option>Đà Nẵng</option>
            <option>TP HCM</option>
          </select>
        ) : (
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
