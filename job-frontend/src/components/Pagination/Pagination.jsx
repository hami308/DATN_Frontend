import styles from "./Pagination.module.css";

const MAX_VISIBLE_PAGES = 10;

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const safeTotalPages = Math.max(Number(totalPages) || 0, 0);
  const safeCurrentPage = Math.min(
    Math.max(Number(currentPage) || 1, 1),
    safeTotalPages || 1
  );

  if (safeTotalPages <= 0) return null;

  const startPage =
    Math.floor((safeCurrentPage - 1) / MAX_VISIBLE_PAGES) *
      MAX_VISIBLE_PAGES +
    1;
  const endPage = Math.min(startPage + MAX_VISIBLE_PAGES - 1, safeTotalPages);
  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <div className={styles.pagination}>
      <button
        disabled={safeCurrentPage === 1}
        onClick={() => onPageChange(safeCurrentPage - 1)}
      >
        Trước
      </button>

      {visiblePages.map((page) => (
        <button
          key={page}
          className={safeCurrentPage === page ? styles.active : ""}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {endPage < safeTotalPages && (
        <span className={styles.ellipsis}>...</span>
      )}

      <button
        disabled={safeCurrentPage === safeTotalPages}
        onClick={() => onPageChange(safeCurrentPage + 1)}
      >
        Tiếp
      </button>
    </div>
  );
}
