import assert from "node:assert/strict";
import test from "node:test";
import { shouldShowHomeHero } from "./should-show-home-hero.ts";

test("쿼리 파라미터가 없는 메인 화면에서 Hero를 노출한다", () => {
  assert.equal(shouldShowHomeHero(new URLSearchParams()), true);
});

test("검색·카테고리·페이지 상태에서는 Hero를 숨긴다", () => {
  assert.equal(shouldShowHomeHero(new URLSearchParams("keyword=react")), false);
  assert.equal(shouldShowHomeHero(new URLSearchParams("category=backend")), false);
  assert.equal(shouldShowHomeHero(new URLSearchParams("page=2")), false);
});
