import assert from "node:assert/strict";
import test from "node:test";
import * as postDetail from "./post-detail.ts";

const { mapPostDetail, postDetailResponseSchema } = postDetail;

test("게시글 조회수는 단어 없이 한국어 숫자 형식으로 표시한다", () => {
  assert.equal(typeof postDetail.formatPostViewCount, "function");
  assert.equal(postDetail.formatPostViewCount?.(1234), "1,234");
});

test("공개 게시글 상세 응답을 검증하고 상세 화면 모델로 변환한다", () => {
  const parsed = postDetailResponseSchema.parse({
    postId: 1,
    title: "Spring Security 정리",
    summary: "세션 인증 흐름을 정리합니다.",
    content: '<h2 id="session">세션 인증</h2>',
    viewCount: 128,
    thumbnailImageId: null,
    categoryName: "Backend",
    categorySlug: "backend",
    tags: [
      { tagId: 3, name: "Java", slug: "java" },
      { tagId: 4, name: "Spring", slug: "spring" },
    ],
    contentImageIds: [11, 12],
    createdAt: "2026-08-13T12:00:00",
    updatedAt: "2026-08-13T12:30:00",
  });

  assert.deepEqual(mapPostDetail(parsed), {
    id: 1,
    title: "Spring Security 정리",
    summary: "세션 인증 흐름을 정리합니다.",
    viewCount: 128,
    category: "Backend",
    createdAt: "2026.08.13",
    content: '<h2 id="session">세션 인증</h2>',
    tags: ["Java", "Spring"],
  });
});

test("필수 상세 응답 필드가 빠지면 거부한다", () => {
  const result = postDetailResponseSchema.safeParse({
    postId: 1,
    title: "제목",
    content: "<p>본문</p>",
    categoryName: "Backend",
    categorySlug: "backend",
    tags: [],
    contentImageIds: [],
    createdAt: "2026-08-13T12:00:00",
    updatedAt: "2026-08-13T12:30:00",
  });

  assert.equal(result.success, false);
});
