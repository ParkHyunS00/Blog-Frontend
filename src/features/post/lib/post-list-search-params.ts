export function getSelectedCategorySlug(searchParams: URLSearchParams): string | null {
  return searchParams.get("category") || null;
}

export function getSearchKeyword(searchParams: URLSearchParams): string | null {
  return searchParams.get("keyword")?.trim() || null;
}

export function getSelectedTagSlugs(searchParams: URLSearchParams): string[] {
  const tags = searchParams
    .getAll("tags")
    .map((tag) => tag.trim())
    .filter(Boolean);
  return [...new Set(tags)];
}

export function searchParamsForKeyword(currentSearchParams: URLSearchParams, keyword: string): URLSearchParams {
  const nextSearchParams = new URLSearchParams(currentSearchParams);
  const normalizedKeyword = keyword.trim();

  if (normalizedKeyword) {
    nextSearchParams.set("keyword", normalizedKeyword);
  } else {
    nextSearchParams.delete("keyword");
  }

  nextSearchParams.delete("category");
  nextSearchParams.delete("tags");
  nextSearchParams.delete("page");

  return nextSearchParams;
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
  nextSearchParams.delete("keyword");
  nextSearchParams.delete("page");

  return nextSearchParams;
}

export function searchParamsForPage(currentSearchParams: URLSearchParams, page: number): URLSearchParams {
  const nextSearchParams = new URLSearchParams(currentSearchParams);

  if (page === 1) {
    nextSearchParams.delete("page");
  } else {
    nextSearchParams.set("page", String(page));
  }

  return nextSearchParams;
}
