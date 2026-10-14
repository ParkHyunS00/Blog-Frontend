export function wrapPostTables(html: string): string {
  if (!/<table\b/i.test(html)) return html;
  const document = new DOMParser().parseFromString(
    `<!doctype html><html><body>${html}</body></html>`, "text/html",
  );
  document.querySelectorAll("table").forEach((table, index) => {
    if (table.getAttribute("data-table-layout") === "equal") {
      const firstRow = table.querySelector(":scope > thead > tr, :scope > tbody > tr, :scope > tr");
      const columns = Array.from(firstRow?.children ?? []).reduce((count, cell) =>
        count + Math.max(1, Math.min(1000, Number.parseInt(cell.getAttribute("colspan") ?? "1", 10) || 1)), 0);
      // Display-only minimum width; the saved layout attribute is authoritative.
      table.style.minWidth = `${columns * TABLE_CELL_MIN_WIDTH}px`;
    }
    let wrapper = table.parentElement;
    if (!wrapper?.classList.contains("tableWrapper")) {
      wrapper = document.createElement("div");
      wrapper.className = "tableWrapper";
      table.replaceWith(wrapper);
      wrapper.appendChild(table);
    }
    wrapper.setAttribute("role", "region");
    wrapper.setAttribute("aria-label", `표 ${index + 1} (가로 스크롤 가능)`);
    wrapper.setAttribute("tabindex", "0");
  });
  return document.body.innerHTML;
}
import { TABLE_CELL_MIN_WIDTH } from "./table-layout.ts";
