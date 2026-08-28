import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPostListSearchParams,
  mapPostListItem,
  postListResponseSchema,
} from "./post-list.ts";

test("게시글 목록 검색 조건을 반복 태그와 0-based 페이지로 직렬화한다", () => {
  const params = buildPostListSearchParams({
    category: "backend",
    tags: ["java", "spring"],
    keyword: "security",
    page: 2,
    size: 5,
  });

  assert.equal(
    params.toString(),
    "category=backend&tags=java&tags=spring&keyword=security&page=2&size=5",
  );
});

test("빈 검색 조건에는 API 기본 페이지 값만 포함한다", () => {
  const params = buildPostListSearchParams({ page: 0, size: 5 });

  assert.equal(params.toString(), "page=0&size=5");
});

test("게시글 목록 응답을 검증하고 카드 모델로 변환한다", () => {
  const parsed = postListResponseSchema.parse({
    content: [
      {
        postId: 1,
        title: "Spring Security 정리",
        summary: "세션 인증 흐름을 정리합니다.",
        thumbnailImageId: 10,
        categoryName: "Backend",
        categorySlug: "backend",
        tags: [{ tagId: 3, name: "Java", slug: "java" }],
        createdAt: "2026-08-13T12:00:00",
        updatedAt: "2026-08-13T12:30:00",
      },
    ],
    page: 0,
    size: 5,
    totalElements: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  assert.deepEqual(mapPostListItem(parsed.content[0], "https://api.example.com"), {
    id: 1,
    title: "Spring Security 정리",
    summary: "세션 인증 흐름을 정리합니다.",
    thumbnailUrl: "https://api.example.com/api/post-images/10",
    tags: ["Java"],
    category: "Backend",
    createdAt: "2026.08.13",
  });
});

test("썸네일이 없는 실제 게시글 응답을 허용한다", () => {
  const item = postListResponseSchema.parse({
    content: [
      {
        postId: 10,
        title: "게시글 페이지네이션 구현",
        summary: "Spring Data Page를 이용해 게시글을 조회합니다.",
        thumbnailImageId: null,
        categoryName: "Backend",
        categorySlug: "backend",
        tags: [],
        createdAt: "2026-08-02T21:17:20",
        updatedAt: "2026-08-02T21:17:20",
      },
    ],
    page: 0,
    size: 5,
    totalElements: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  }).content[0];

  assert.equal(mapPostListItem(item, "https://api.example.com").thumbnailUrl, null);
});
