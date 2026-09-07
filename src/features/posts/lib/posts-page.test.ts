import assert from "node:assert/strict";
import test from "node:test";
import * as postsPage from "./posts-page.ts";

test("천 단위 이상인 조회수는 소수점 한 자리의 K 단위로 표시한다", () => {
  const candidate = Reflect.get(postsPage, "formatCompactViewCount");

  assert.equal(typeof candidate, "function");
  const formatCompactViewCount = candidate as (viewCount: number) => string;
  assert.equal(formatCompactViewCount(999), "999");
  assert.equal(formatCompactViewCount(1000), "1K");
  assert.equal(formatCompactViewCount(9800), "9.8K");
  assert.equal(formatCompactViewCount(12400), "12.4K");
  assert.equal(formatCompactViewCount(12550), "12.6K");
});
