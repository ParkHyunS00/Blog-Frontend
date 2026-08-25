import assert from "node:assert/strict";
import test from "node:test";
import { getHomeUrlWithoutLegacyPostListHash } from "./home-location.ts";

test("기존 post-list 해시를 경로와 검색 조건만 남긴 URL로 정리한다", () => {
  assert.equal(
    getHomeUrlWithoutLegacyPostListHash("/", "?page=2", "#post-list"),
    "/?page=2",
  );
});

test("post-list가 아닌 해시는 변경하지 않는다", () => {
  assert.equal(getHomeUrlWithoutLegacyPostListHash("/", "", "#section"), null);
  assert.equal(getHomeUrlWithoutLegacyPostListHash("/", "", ""), null);
});
