import assert from "node:assert/strict";
import test from "node:test";
import { getHomePostsRevealOpacity } from "./home-posts-reveal.ts";

test("게시글 프리뷰 블러는 스크롤 시작 후 점차 사라진다", () => {
  assert.equal(getHomePostsRevealOpacity(0), 1);
  assert.equal(getHomePostsRevealOpacity(90), 0.5);
  assert.equal(getHomePostsRevealOpacity(180), 0);
  assert.equal(getHomePostsRevealOpacity(300), 0);
});

test("음수 스크롤 위치에서도 블러 투명도는 1을 넘지 않는다", () => {
  assert.equal(getHomePostsRevealOpacity(-20), 1);
});
