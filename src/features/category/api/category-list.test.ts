import assert from "node:assert/strict";
import test from "node:test";
import { buildCategories, categoryListSchema } from "./category-list.ts";

test("카테고리 응답에 전체 게시글 개수를 합산한 ALL 항목을 추가한다", () => {
  const parsed = categoryListSchema.parse([
    { categoryId: 1, name: "Backend", slug: "backend", postCount: 8 },
    { categoryId: 2, name: "DevOps", slug: "devops", postCount: 2 },
  ]);

  assert.deepEqual(buildCategories(parsed), [
    { name: "ALL", slug: null, count: 10 },
    { name: "Backend", slug: "backend", count: 8 },
    { name: "DevOps", slug: "devops", count: 2 },
  ]);
});
