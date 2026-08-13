import assert from "node:assert/strict";
import test from "node:test";
import { normalizePostPage } from "./normalize-post-page.ts";

test("응답의 전체 페이지보다 큰 URL 페이지를 마지막 페이지로 정규화한다", () => {
  assert.equal(normalizePostPage(999, 3), 3);
});

test("게시글이 없으면 첫 페이지를 유지한다", () => {
  assert.equal(normalizePostPage(4, 0), 1);
});

test("유효한 URL 페이지는 변경하지 않는다", () => {
  assert.equal(normalizePostPage(2, 3), 2);
});
