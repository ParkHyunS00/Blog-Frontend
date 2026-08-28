export function optimizePostContentImages(html: string): string {
  const document = new DOMParser().parseFromString(
    `<!doctype html><html><body>${html}</body></html>`,
    "text/html",
  );
  const images = Array.from(document.body.querySelectorAll("img"));

  if (images.length === 0) return html;

  images.forEach((image, index) => {
    const isLcpCandidate = index === 0;

    image.setAttribute("loading", isLcpCandidate ? "eager" : "lazy");
    image.setAttribute("fetchpriority", isLcpCandidate ? "high" : "low");
    image.setAttribute("decoding", "async");
  });

  return document.body.innerHTML;
}
