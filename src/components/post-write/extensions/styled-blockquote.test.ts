import assert from "node:assert/strict";
import test from "node:test";
import { parseHTML } from "linkedom";
import { Editor, getSchema } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DOMParser, DOMSerializer } from "@tiptap/pm/model";
import { StyledBlockquote } from "./styled-blockquote.ts";
import { QUOTE_STYLES } from "../../../features/post/lib/quote-style.ts";

const { document, window } = parseHTML("<!doctype html><html><body></body></html>");
Object.defineProperty(globalThis, "window", { configurable: true, value: window });
Object.defineProperty(globalThis, "document", { configurable: true, value: document });
const extensions = [StarterKit.configure({ blockquote: false }), StyledBlockquote];
const schema = getSchema(extensions);

function parse(html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return DOMParser.fromSchema(schema).parse(container);
}

function serialize(doc: ReturnType<typeof parse>): string {
  const container = document.createElement("div");
  container.appendChild(DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document }));
  return container.innerHTML;
}

for (const { value, label } of QUOTE_STYLES) {
  test(`${label}: 저장 후 재편집해도 스타일과 본문 서식을 유지한다`, () => {
    const doc = parse(`<blockquote data-quote-style="${value}"><p><strong>강조</strong> 본문</p><p>두 번째 문단</p></blockquote>`);
    const html = serialize(doc);
    const restored = parse(html);
    assert.deepEqual(restored.toJSON(), doc.toJSON());
    assert.equal(restored.textContent, "강조 본문두 번째 문단");
    assert.equal(restored.firstChild?.attrs.quoteStyle, value);
    assert.equal(html.includes("quote-title"), value !== "default");
    if (value !== "default") assert.ok(html.includes(`<span>${label}</span>`));
    assert.equal(serialize(restored), html);
  });
}

test("기존 인용문과 알 수 없는 스타일은 기본 인용으로 유지한다", () => {
  for (const attrs of ["", ' data-quote-style="unknown"']) {
    const html = `<blockquote${attrs}><p>기존 인용</p></blockquote>`;
    assert.equal(serialize(parse(html)), "<blockquote><p>기존 인용</p></blockquote>");
  }
});

test("인용 생성·스타일 변경·해제가 본문을 보존한다", () => {
  const editor = new Editor({ element: null, extensions, content: parse("<p>본문</p>").toJSON() });
  try {
    editor.commands.setTextSelection(2);
    assert.equal(editor.commands.wrapIn("blockquote", { quoteStyle: "note" }), true);
    assert.equal(editor.commands.updateAttributes("blockquote", { quoteStyle: "warning" }), true);
    assert.equal(editor.getJSON().content?.[0].attrs?.quoteStyle, "warning");
    assert.equal(editor.commands.unsetBlockquote(), true);
    assert.equal(serialize(editor.state.doc), "<p>본문</p>");
  } finally {
    editor.destroy();
  }
});
