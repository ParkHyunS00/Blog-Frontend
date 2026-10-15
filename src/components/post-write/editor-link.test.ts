import assert from "node:assert/strict";
import test from "node:test";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { normalizeLinkUrl, defaultLinkText, insertEditorLink } from "./editor-link.ts";

function createEditor(text = "") {
  return new Editor({ element: null, extensions: [StarterKit], content: { type: "doc", content: [{ type: "paragraph", ...(text ? { content: [{ type: "text", text, marks: [{ type: "bold" }] }] } : {}) }] } });
}

test("선택한 글자가 없어도 링크 텍스트를 즉시 삽입하고 다음 입력은 링크 밖에 둔다", () => {
  const editor = createEditor();
  try {
    assert.equal(insertEditorLink(editor, { from: 1, to: 1 }, "https://example.com/", "검색 결과"), true);
    assert.equal(editor.state.doc.textContent, "검색 결과");
    assert.equal(editor.state.doc.firstChild?.firstChild?.marks[0].attrs.href, "https://example.com/");
    editor.commands.insertContent({ type: "text", text: " 다음 글자" });
    assert.equal(editor.state.doc.firstChild?.lastChild?.marks.some((mark) => mark.type.name === "link"), false);
  } finally { editor.destroy(); }
});

test("선택된 문구에 링크를 붙일 때 기존 굵은 서식을 보존한다", () => {
  const editor = createEditor("선택 문구");
  try {
    insertEditorLink(editor, { from: 1, to: 6 }, "https://example.com/", "선택 문구");
    assert.equal(editor.state.doc.textContent, "선택 문구");
    assert.deepEqual(editor.state.doc.firstChild?.firstChild?.marks.map((mark) => mark.type.name).sort(), ["bold", "link"]);
  } finally { editor.destroy(); }
});

test("긴 검색 주소는 표시명만 줄이고 쿼리와 해시를 포함한 목적지는 유지한다", () => {
  const href = `https://example.com/search?q=${"long-query".repeat(20)}#results`;
  const editor = createEditor();
  try {
    insertEditorLink(editor, { from: 1, to: 1 }, href, "");
    assert.equal(editor.state.doc.textContent, `${href.slice(0, 67)}...`);
    assert.equal(editor.state.doc.firstChild?.firstChild?.marks[0].attrs.href, href);
    assert.equal(defaultLinkText("https://example.com/"), "https://example.com/");
  } finally { editor.destroy(); }
});

test("웹 주소는 정규화하고 실행 가능한 스킴과 잘못된 입력은 거부한다", () => {
  assert.equal(normalizeLinkUrl(" example.com/path?q=1 "), "https://example.com/path?q=1");
  for (const value of ["", "javascript:alert(1)", "data:text/html,test", "http://", "주소 공백"]) assert.equal(normalizeLinkUrl(value), null);
});


test("70자 주소는 유지하고 71자부터 앞 67자와 말줄임으로 표시한다", () => {
  const url = "https://example.com/".padEnd(70, "a");
  assert.equal(defaultLinkText(url), url);
  assert.equal(defaultLinkText(url + "b"), url.slice(0, 67) + "...");
  assert.equal(defaultLinkText(url + "b").length, 70);
});
