import type { TocItem } from "@/features/post/types/post.types";

type PreparedTocContent = {
  html: string;
  items: TocItem[];
};

function createHeadingId(text: string): string {
  return text
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function prepareTocContent(html: string): PreparedTocContent {
  const doc = new DOMParser().parseFromString(
    `<!doctype html><html><body>${html}</body></html>`,
    "text/html",
  );
  const headings = Array.from(doc.querySelectorAll("h2, h3"));
  const usedIds = new Set(
    headings.map((heading) => heading.id).filter((id) => id.length > 0),
  );

  for (const heading of headings) {
    if (heading.id) continue;

    const baseId = createHeadingId(heading.textContent ?? "") || "section";
    let id = baseId;
    let suffix = 2;

    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    heading.id = id;
    usedIds.add(id);
  }

  return {
    html: doc.body.innerHTML,
    items: headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent ?? "",
      level: Number(heading.tagName[1]),
    })),
  };
}
