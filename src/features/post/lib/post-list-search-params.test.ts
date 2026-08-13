import assert from "node:assert/strict";
import test from "node:test";
import {
  getSelectedCategorySlug,
  searchParamsForCategory,
  searchParamsForPage,
} from "./post-list-search-params.ts";

test("카테고리를 선택하면 category를 설정하고 기존 page를 제거한다", () => {
  const params = searchParamsForCategory(new URLSearchParams("category=devops&page=3"), "backend");

  assert.equal(params.toString(), "category=backend");
});

test("ALL을 선택하면 category와 page를 모두 제거한다", () => {
  const params = searchParamsForCategory(new URLSearchParams("category=backend&page=2"), null);

  assert.equal(params.toString(), "");
});

test("페이지를 변경하면 선택된 category를 보존한다", () => {
  const params = searchParamsForPage(new URLSearchParams("category=backend"), 2);

  assert.equal(params.toString(), "category=backend&page=2");
});

test("첫 페이지로 이동하면 page만 제거한다", () => {
  const params = searchParamsForPage(new URLSearchParams("category=backend&page=2"), 1);

  assert.equal(params.toString(), "category=backend");
});

test("URL에서 빈 category는 전체 목록으로 해석한다", () => {
  assert.equal(getSelectedCategorySlug(new URLSearchParams("category=")), null);
});
