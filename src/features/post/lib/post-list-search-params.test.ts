import assert from "node:assert/strict";
import test from "node:test";
import {
  getSelectedCategorySlug,
  getSearchKeyword,
  searchParamsForCategory,
  searchParamsForKeyword,
  searchParamsForPage,
} from "./post-list-search-params.ts";

test("카테고리를 선택하면 category를 설정하고 기존 page를 제거한다", () => {
  const params = searchParamsForCategory(
    new URLSearchParams("category=devops&keyword=spring&page=3"),
    "backend",
  );

  assert.equal(params.toString(), "category=backend");
});

test("ALL을 선택하면 category와 page를 모두 제거한다", () => {
  const params = searchParamsForCategory(
    new URLSearchParams("category=backend&keyword=spring&page=2"),
    null,
  );

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

test("검색어를 제출하면 공백을 정리하고 기존 필터와 페이지를 제거한다", () => {
  const params = searchParamsForKeyword(
    new URLSearchParams("category=backend&tags=java&page=3"),
    "  스프링 보안  ",
  );

  assert.equal(params.toString(), "keyword=%EC%8A%A4%ED%94%84%EB%A7%81+%EB%B3%B4%EC%95%88");
});

test("빈 검색어를 제출하면 검색 조건을 제거한다", () => {
  const params = searchParamsForKeyword(new URLSearchParams("keyword=spring&page=2"), "   ");

  assert.equal(params.toString(), "");
});

test("URL의 검색어는 앞뒤 공백을 제거해 읽는다", () => {
  assert.equal(getSearchKeyword(new URLSearchParams("keyword=++spring+security++")), "spring security");
  assert.equal(getSearchKeyword(new URLSearchParams("keyword=+++")), null);
});
