import assert from "node:assert/strict";
import test from "node:test";
import { getPostTagSizeClassName } from "./post-tag.styles.ts";

test("목록용 태그는 작은 크기 스타일을 사용한다", () => {
  assert.equal(getPostTagSizeClassName("sm"), "px-3 py-1 text-xs");
});

test("상세용 태그는 큰 크기 스타일을 사용한다", () => {
  assert.equal(getPostTagSizeClassName("lg"), "px-4 py-2 text-sm");
});
