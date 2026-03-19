import type { TocItem } from "@/features/post/types/post.types";

const cache = new Map<string, TocItem[]>();

export function parseToc(html: string): TocItem[] {
  const cached = cache.get(html);
  if (cached) return cached;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const headings = doc.querySelectorAll("h2, h3");

  const items = Array.from(headings)
    .filter((heading) => heading.id)
    .map((heading) => ({
      id: heading.id,
      text: heading.textContent ?? "",
      level: Number(heading.tagName[1]),
    }));

  cache.set(html, items);
  return items;
}
