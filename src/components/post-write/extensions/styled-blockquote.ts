import Blockquote from "@tiptap/extension-blockquote";
import { mergeAttributes } from "@tiptap/react";

import { QUOTE_STYLES, normalizeQuoteStyle } from "../../../features/post/lib/quote-style.ts";

export const StyledBlockquote = Blockquote.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      quoteStyle: {
        default: "default",
        parseHTML: (element) => normalizeQuoteStyle(element.getAttribute("data-quote-style")),
        renderHTML: ({ quoteStyle }) => {
          const style = normalizeQuoteStyle(quoteStyle);
          return style === "default" ? {} : { "data-quote-style": style };
        },
      },
    };
  },

  parseHTML() {
    return [{
      tag: "blockquote",
      // The generated title is decoration, never editable document content.
      contentElement: (element) => element.querySelector(":scope > .quote-content") ?? element,
    }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const style = normalizeQuoteStyle(node.attrs.quoteStyle);
    const attributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);
    if (style === "default") return ["blockquote", attributes, 0];

    const label = QUOTE_STYLES.find((item) => item.value === style)!.label;
    return [
      "blockquote", attributes,
      ["div", { class: "quote-title", contenteditable: "false" },
        ["span", { class: "quote-icon", "aria-hidden": "true" }],
        ["span", {}, label],
      ],
      ["div", { class: "quote-content" }, 0],
    ];
  },
});
