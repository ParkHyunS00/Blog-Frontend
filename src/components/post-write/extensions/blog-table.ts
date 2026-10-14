import { Table, TableCell, TableHeader } from "@tiptap/extension-table";
import { mergeAttributes } from "@tiptap/react";
import { TableMap } from "@tiptap/pm/tables";
import { normalizeTableLayout, TABLE_CELL_MIN_WIDTH } from "../../../features/post/lib/table-layout.ts";
import { normalizeTableTheme } from "../../../features/post/lib/table-theme.ts";

// Persist alignment using the server's allowed attribute, rather than inline CSS.
const alignment = {
  default: null,
  parseHTML: (element: HTMLElement) => {
    const value = element.getAttribute("align");
    return value === "left" || value === "center" || value === "right" ? value : null;
  },
  renderHTML: (attributes: Record<string, unknown>) => {
    const value = attributes.align;
    return value === "left" || value === "center" || value === "right" ? { align: value } : {};
  },
};

export const BlogTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      theme: {
        default: "default",
        parseHTML: (element) => normalizeTableTheme(element.getAttribute("data-table-theme")),
        renderHTML: ({ theme }) => {
          const value = normalizeTableTheme(theme);
          return value === "default" ? {} : { "data-table-theme": value };
        },
      },
      layout: {
        default: "auto",
        parseHTML: (element) => normalizeTableLayout(element.getAttribute("data-table-layout")),
        renderHTML: ({ layout }) => normalizeTableLayout(layout) === "equal" ? { "data-table-layout": "equal" } : {},
      },
    };
  },
  renderHTML(props) {
    if (normalizeTableLayout(props.node.attrs.layout) !== "equal") return this.parent!(props);
    const columns = TableMap.get(props.node).width;
    // Fixed layout distributes logical columns equally, including merged cells.
    return ["div", { class: "tableWrapper" },
      ["table", mergeAttributes(this.options.HTMLAttributes, props.HTMLAttributes, {
        style: `min-width: ${columns * TABLE_CELL_MIN_WIDTH}px`,
      }),
      ["colgroup", {}, ...Array.from({ length: columns }, () => ["col", {}])],
      ["tbody", 0]],
    ];
  },
}).configure({ resizable: false, renderWrapper: true });
export const BlogTableCell = TableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), align: alignment };
  },
});
export const BlogTableHeader = TableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), align: alignment };
  },
});
