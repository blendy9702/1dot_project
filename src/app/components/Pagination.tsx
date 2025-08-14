"use client";

import styles from "../page.module.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isHidden?: boolean;
};

// shadcn/ui Pagination 구조를 참고한 경량 구현
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isHidden,
}: PaginationProps) {
  if (isHidden || totalPages <= 1) return null;

  const MAX_BUTTONS = 7;
  const buildButtons = (): number[] => {
    if (totalPages <= MAX_BUTTONS) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // 연속 윈도우: 현재 페이지 기준으로 좌우로 확장, 경계에서 보정
    let start = currentPage - Math.floor(MAX_BUTTONS / 2); // cp - 3
    let end = currentPage + Math.floor(MAX_BUTTONS / 2); // cp + 3
    if (start < 1) {
      end += 1 - start;
      start = 1;
    }
    if (end > totalPages) {
      start -= end - totalPages;
      end = totalPages;
    }
    start = Math.max(1, start);
    const pages: number[] = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  };

  const buttons = buildButtons();

  return (
    <nav className={styles.pgNav} aria-label="페이지네이션">
      <ul className={styles.pgList}>
        <li className={styles.pgItem}>
          <button
            type="button"
            className={styles.pgLink}
            aria-label="처음"
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          >
            «
          </button>
        </li>
        <li className={styles.pgItem}>
          <button
            type="button"
            className={styles.pgLink}
            aria-label="이전"
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          >
            ‹
          </button>
        </li>
        {buttons.map((p) => (
          <li key={p} className={styles.pgItem}>
            <button
              type="button"
              className={`${styles.pgLink} ${
                p === currentPage ? styles.pgLinkActive : ""
              }`}
              onClick={() => onPageChange(p)}
              disabled={p === currentPage}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </button>
          </li>
        ))}
        <li className={styles.pgItem}>
          <button
            type="button"
            className={styles.pgLink}
            aria-label="다음"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          >
            ›
          </button>
        </li>
        <li className={styles.pgItem}>
          <button
            type="button"
            className={styles.pgLink}
            aria-label="마지막"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            »
          </button>
        </li>
      </ul>
    </nav>
  );
}
