import assert from "node:assert/strict";
import test from "node:test";
import { parseHTML } from "linkedom";
import { Editor, getSchema } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DOMParser, DOMSerializer } from "@tiptap/pm/model";
import { ToggleBlock, ToggleSummary, ToggleContent } from "./toggle-block.ts";

const { window, document } = parseHTML("<!doctype html><html><body></body></html>");
Object.defineProperty(globalThis, "window", { configurable: true, value: window });
Object.defineProperty(globalThis, "document", { configurable: true, value: document });
const extensions = [StarterKit, ToggleBlock, ToggleSummary, ToggleContent];
const schema = getSchema(extensions);
function parse(html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return DOMParser.fromSchema(schema).parse(container);
}
function serialize(doc: ReturnType<typeof parse>) {
  const container = document.createElement("div");
  container.appendChild(DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document }));
  return container.innerHTML;
}
const source = '<details data-type="toggle"><summary><strong>자세히 보기</strong></summary><div data-type="toggle-content"><p>설명</p><ul><li><p>목록</p></li></ul></div></details>';

test("접기 제목과 서식 있는 본문을 저장·재편집하고 기본 접힘을 유지한다", () => {
  const doc = parse(source);
  const html = serialize(doc);
  assert.deepEqual(parse(html).toJSON(), doc.toJSON());
  assert.equal(doc.textContent, "자세히 보기설명목록");
  assert.match(html, /<summary><strong>자세히 보기<\/strong><\/summary>/);
  assert.doesNotMatch(html, /\bopen[=>\s]/);
});

test("선택한 여러 문단을 접기에 넣어도 내용과 순서를 보존한다", () => {
  const editor = new Editor({ element: null, extensions, content: parse('<p>첫 문단</p><p>두 번째 문단</p>').toJSON() });
  try {
    editor.commands.selectAll();
    assert.equal(editor.commands.insertToggleBlock(), true);
    assert.equal(editor.state.doc.firstChild?.type.name, "toggleBlock");
    assert.equal(editor.state.doc.textContent, "첫 문단두 번째 문단");
    assert.equal(editor.state.selection.$from.parent.type.name, "toggleSummary");
    assert.equal(editor.commands.unsetToggleBlock(), true);
    assert.equal(serialize(editor.state.doc), '<p>첫 문단</p><p>두 번째 문단</p>');
  } finally { editor.destroy(); }
});

test("접기 해제는 제목을 문단으로 바꾸고 목록을 보존한다", () => {
  const editor = new Editor({ element: null, extensions, content: parse(source).toJSON() });
  try {
    editor.commands.setTextSelection(2);
    assert.equal(editor.commands.unsetToggleBlock(), true);
    assert.equal(serialize(editor.state.doc), '<p><strong>자세히 보기</strong></p><p>설명</p><ul><li><p>목록</p></li></ul>');
  } finally { editor.destroy(); }
});

test("접기 밖으로 이동하면 후속 문단을 만들고 기존 문단은 재사용한다", () => {
  for (const suffix of ["", '<p>다음 내용</p>']) {
    const editor = new Editor({ element: null, extensions, content: parse(source + suffix).toJSON() });
    try {
      editor.commands.setTextSelection(2);
      assert.equal(editor.commands.exitToggleBlock(), true);
      assert.equal(editor.state.doc.childCount, 2);
      assert.equal(editor.state.selection.$from.depth, 1);
      assert.equal(editor.state.doc.lastChild?.textContent, suffix ? "다음 내용" : "");
    } finally { editor.destroy(); }
  }
});

test("중첩 접기도 저장 후 구조를 유지한다", () => {
  const html = source.replace('<p>설명</p>', source);
  assert.deepEqual(parse(serialize(parse(html))).toJSON(), parse(html).toJSON());
});


test("빈 문서를 기본 문단으로 생성하고 새 글과 내용 초기화를 처리한다", () => {
  assert.equal(schema.topNodeType.createAndFill()?.firstChild?.type.name, "paragraph");
  const editor = new Editor({ element: null, extensions, content: "" });
  try {
    assert.equal(serialize(editor.state.doc), "<p></p>");
    assert.equal(editor.commands.insertToggleBlock(), true);
    assert.equal(editor.state.doc.firstChild?.lastChild?.firstChild?.type.name, "paragraph");
    editor.commands.clearContent();
    assert.equal(serialize(editor.state.doc), "<p></p>");
    editor.commands.setContent("");
    assert.equal(serialize(editor.state.doc), "<p></p>");
  } finally { editor.destroy(); }
});
