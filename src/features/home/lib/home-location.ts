const LEGACY_POST_LIST_HASH = "#post-list";

export function getHomeUrlWithoutLegacyPostListHash(
  pathname: string,
  search: string,
  hash: string,
): string | null {
  return hash === LEGACY_POST_LIST_HASH ? `${pathname}${search}` : null;
}
