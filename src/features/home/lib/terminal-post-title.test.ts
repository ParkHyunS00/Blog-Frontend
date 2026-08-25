import assert from "node:assert/strict";
import test from "node:test";
import { truncateTerminalPostTitle } from "./terminal-post-title.ts";

test("최신 글 제목이 제한 길이 이하면 그대로 표시한다", () => {
  assert.equal(truncateTerminalPostTitle("짧은 게시글 제목", 10), "짧은 게시글 제목");
});

test("최신 글 제목이 제한 길이를 넘으면 말줄임표를 붙인다", () => {
  assert.equal(truncateTerminalPostTitle("1234567890", 7), "1234567...");
});

test("이모지를 중간에서 잘라 깨뜨리지 않는다", () => {
  assert.equal(truncateTerminalPostTitle("글😀제목", 2), "글😀...");
});
