import assert from "node:assert/strict";
import test from "node:test";
import { getEditorIndentationText } from "./editor-indentation.ts";

test("코드 블록의 Tab은 일반 공백 네 칸을 삽입한다", () => {
  assert.equal(getEditorIndentationText(true), "    ");
});

test("일반 문단의 Tab은 접히지 않는 공백 네 칸을 삽입한다", () => {
  assert.equal(getEditorIndentationText(false), "\u00A0\u00A0\u00A0\u00A0");
});
