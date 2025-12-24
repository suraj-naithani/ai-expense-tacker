import { useEffect, useState, useCallback, useRef } from "react";

interface UsePaginationOptions {
  defaultPageSize?: number;
  resetDependencies?: unknown[];
  onPageSizeChange?: () => void;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { defaultPageSize = 10, resetDependencies = [], onPageSizeChange } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const prevPageSizeRef = useRef(pageSize);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDependencies);

  useEffect(() => {
    if (prevPageSizeRef.current !== pageSize) {
      setCurrentPage(1);
      prevPageSizeRef.current = pageSize;
    }
  }, [pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback(
    (newSize: string) => {
      const newPageSize = Number(newSize);
      setPageSize(newPageSize);
      onPageSizeChange?.();
    },
    [onPageSizeChange]
  );

  return {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  };
}

