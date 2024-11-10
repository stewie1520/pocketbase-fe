import { useMemo, useState } from "react";

export interface Page {
  value?: number;
  isActive: boolean;
}

function usePagination({ currentPage, totalPages = 0 }: { totalPages?: number; currentPage: number }) {
  const pages = useMemo(() => {
    const pages: Page[] = [];
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = Math.max(1, currentPage - 2); i <= end; i++) {
      pages.push({
        value: i,
        isActive: i === currentPage,
      });
    }

    if (end < totalPages - 1) {
      pages.push({ isActive: false, value: undefined });
    }

    if (!pages.length) {
      pages.push({ value: 1, isActive: true });
    }

    return pages;
  }, [currentPage, totalPages]);

  return {
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    pages,
  }
}

export default usePagination;
