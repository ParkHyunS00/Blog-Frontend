import { useSearchParams } from "react-router-dom";

type UsePaginationOptions<T> = {
  items: T[];
  perPage: number;
};

type UsePaginationReturn<T> = {
  currentPage: number;
  totalPages: number;
  currentItems: T[];
  handlePageChange: (page: number) => void;
};

export function usePagination<T>({ items, perPage }: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const rawPage = Number(searchParams.get("page")) || 1;
  const currentPage = rawPage > totalPages ? 1 : rawPage;
  const startIndex = (currentPage - 1) * perPage;
  const currentItems = items.slice(startIndex, startIndex + perPage);

  function handlePageChange(page: number): void {
    setSearchParams(page === 1 ? {} : { page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { currentPage, totalPages, currentItems, handlePageChange };
}
