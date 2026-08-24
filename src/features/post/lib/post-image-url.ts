function normalizeApiBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/$/, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getPostImageDisplayUrl(imageId: number, apiBaseUrl: string): string {
  return `${normalizeApiBaseUrl(apiBaseUrl)}/api/post-images/${imageId}`;
}

export function toPostImageDisplayHtml(html: string, apiBaseUrl: string): string {
  const normalizedBaseUrl = normalizeApiBaseUrl(apiBaseUrl);
  if (!normalizedBaseUrl) return html;

  return html.replace(
    /(\bsrc\s*=\s*["'])(\/api\/post-images\/[1-9][0-9]*)(["'])/gi,
    `$1${normalizedBaseUrl}$2$3`,
  );
}

export function toPostImageStorageHtml(html: string, apiBaseUrl: string): string {
  const normalizedBaseUrl = normalizeApiBaseUrl(apiBaseUrl);
  if (!normalizedBaseUrl) return html;

  const absoluteImagePattern = new RegExp(
    `(\\bsrc\\s*=\\s*["'])${escapeRegExp(normalizedBaseUrl)}(\\/api\\/post-images\\/[1-9][0-9]*)(["'])`,
    "gi",
  );
  return html.replace(absoluteImagePattern, "$1$2$3");
}
