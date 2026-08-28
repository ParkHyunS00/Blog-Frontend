export function normalizePostPage(currentPage: number, totalPages: number): number {
  if (totalPages === 0) return 1;
  return Math.min(currentPage, totalPages);
}

