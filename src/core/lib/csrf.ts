const CSRF_COOKIE_NAME = "XSRF-TOKEN";

export function getCsrfToken(): string | null {
  const pattern = new RegExp(`(?:^|;\\s*)${CSRF_COOKIE_NAME}=([^;]+)`);
  const match = document.cookie.match(pattern);
  return match ? decodeURIComponent(match[1]) : null;
}
