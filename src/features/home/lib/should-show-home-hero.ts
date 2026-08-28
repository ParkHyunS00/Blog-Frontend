export function shouldShowHomeHero(searchParams: URLSearchParams): boolean {
  return searchParams.toString().length === 0;
}
