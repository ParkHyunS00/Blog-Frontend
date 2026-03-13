export type PageItem = number | "ellipsis";

export function getPageNumbers(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(1, Math.min(currentPage, totalPages - 2));
  const end = Math.min(start + 2, totalPages);

  const pages: PageItem[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push("ellipsis");
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push("ellipsis");
    }
    pages.push(totalPages);
  }

  return pages;
}
