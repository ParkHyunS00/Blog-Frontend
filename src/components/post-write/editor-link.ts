import type { Editor } from "@tiptap/react";

export function normalizeLinkUrl(value: string): string | null {
  const input = value.trim();
  if (!input) return null;
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(input);
  try {
    const url = new URL(hasScheme ? input : `https://${input}`);
    if (!["https:", "http:"].includes(url.protocol) || !url.hostname || /\s/.test(input)) return null;
    return url.href;
  } catch { return null; }
}

export function defaultLinkText(href: string): string {
  return href.length > 70 ? `${href.slice(0, 67)}...` : href;
}

export function insertEditorLink(editor: Editor, range: { from: number; to: number }, href: string, label: string): boolean {
  const selected = editor.state.doc.textBetween(range.from, range.to, " ");
  const text = label.trim() || selected || defaultLinkText(href);
  const chain = editor.chain().setTextSelection(range);
  if (range.from !== range.to && text === selected) {
    return chain.setLink({ href, target: "_blank" }).setTextSelection(range.to).unsetMark("link").run();
  }
  return chain.insertContent({ type: "text", text, marks: [{ type: "link", attrs: { href, target: "_blank", rel: "noopener noreferrer" } }] })
    .unsetMark("link").run();
}
