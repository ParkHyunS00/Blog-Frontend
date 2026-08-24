import assert from "node:assert/strict";
import test from "node:test";
import { createFormFromPublishedPost } from "./published-post-form.ts";

test("공개 게시글 상세 응답을 이미지 관계가 포함된 작성 폼으로 변환한다", () => {
  const form = createFormFromPublishedPost({
    postId: 15,
    title: "기존 제목",
    summary: "기존 요약",
    content: '<p>본문</p><img src="/api/post-images/31">',
    thumbnailImageId: 30,
    categoryName: "Backend",
    categorySlug: "backend",
    tags: [{ tagId: 1, name: "Java", slug: "java" }],
    contentImageIds: [31],
    createdAt: "2026-08-20T10:00:00",
    updatedAt: "2026-08-20T10:00:00",
  }, "https://api.example.com");

  assert.deepEqual(form, {
    title: "기존 제목",
    summary: "기존 요약",
    thumbnailFile: null,
    thumbnailUrl: "https://api.example.com/api/post-images/30",
    thumbnailImageId: 30,
    category: "Backend",
    tags: ["Java"],
    content: '<p>본문</p><img src="/api/post-images/31">',
    contentImageIds: [31],
  });
});
