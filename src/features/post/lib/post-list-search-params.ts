export function getSelectedCategorySlug(searchParams: URLSearchParams): string | null {
  return searchParams.get("category") || null;
}

export function searchParamsForCategory(
  currentSearchParams: URLSearchParams,
  categorySlug: string | null,
): URLSearchParams {
  const nextSearchParams = new URLSearchParams(currentSearchParams);

  if (categorySlug) {
    nextSearchParams.set("category", categorySlug);
  } else {
    nextSearchParams.delete("category");
  }
  nextSearchParams.delete("page");

  return nextSearchParams;
}

export function searchParamsForPage(
  currentSearchParams: URLSearchParams,
  page: number,
): URLSearchParams {
  const nextSearchParams = new URLSearchParams(currentSearchParams);

  if (page === 1) {
    nextSearchParams.delete("page");
  } else {
    nextSearchParams.set("page", String(page));
  }

  return nextSearchParams;
}
