import assert from "node:assert/strict";
import test from "node:test";
import {
  getPostImageDisplayUrl,
  toPostImageDisplayHtml,
  toPostImageStorageHtml,
} from "./post-image-url.ts";

const API_BASE_URL = "http://localhost:8080";

test("이미지 ID를 API 서버의 조회 URL로 변환한다", () => {
  assert.equal(getPostImageDisplayUrl(12, API_BASE_URL), "http://localhost:8080/api/post-images/12");
});

test("저장 HTML의 상대 이미지 URL만 화면 표시용 절대 URL로 변환한다", () => {
  const html = '<img src="/api/post-images/12"><img src="https://external.example/image.png">';
  assert.equal(
    toPostImageDisplayHtml(html, API_BASE_URL),
    '<img src="http://localhost:8080/api/post-images/12"><img src="https://external.example/image.png">',
  );
});

test("에디터 HTML의 API 절대 URL을 서버 저장용 상대 URL로 복원한다", () => {
  const html = '<img src="http://localhost:8080/api/post-images/12"><img src="https://external.example/image.png">';
  assert.equal(
    toPostImageStorageHtml(html, API_BASE_URL),
    '<img src="/api/post-images/12"><img src="https://external.example/image.png">',
  );
});

test("API base URL이 비어 있으면 상대 URL을 유지한다", () => {
  assert.equal(getPostImageDisplayUrl(12, ""), "/api/post-images/12");
  assert.equal(toPostImageDisplayHtml('<img src="/api/post-images/12">', ""), '<img src="/api/post-images/12">');
});
