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
    if (!image.closest("a, button")) {
      image.setAttribute("data-image-viewer", "true");
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `${image.getAttribute("alt") || "이미지"} 크게 보기`);
    }
  });

  return document.body.innerHTML;
}
