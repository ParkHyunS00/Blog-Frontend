import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import {
  fetchCategoryLatestPosts,
  fetchPopularPosts,
  categoryLatestSchema,
  popularPostsSchema,
} from "./posts-explore.ts";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("카테고리 최신 글은 쿼리 없는 GET으로 전체를 받아 화면 데이터로 변환한다", async () => {
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), "/api/categories/latest-posts");
    assert.equal(init?.method, "GET");
    return Response.json({
      status: 200,
      error: null,
      data: [
        {
          categoryId: 1,
          categoryName: "Backend",
          categorySlug: "backend",
          postCount: 8,
          latestPost: {
            postId: 42,
            title: "최신 글",
            summary: "요약",
            createdAt: "2026-09-06T12:00:00",
          },
        },
      ],
    });
  };
  assert.deepEqual(await fetchCategoryLatestPosts(), [
    {
      category: "Backend",
      categorySlug: "backend",
      postCount: 8,
      title: "최신 글",
      summary: "요약",
      updatedAt: "2026.09.06",
    },
  ]);
});

test("인기 글은 서버 순서와 조회수 0을 유지한다", async () => {
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), "/api/posts/popular");
    assert.equal(init?.method, "GET");
    return Response.json({
      status: 200,
      error: null,
      data: [42, 21].map((postId) => ({
        postId,
        title: "글",
        categoryName: "Backend",
        categorySlug: "backend",
        createdAt: "2026-09-06T12:00:00",
        viewCount: 0,
      })),
    });
  };
  const posts = await fetchPopularPosts();
  assert.deepEqual(
    posts.map((post) => post.id),
    [42, 21],
  );
  assert.equal(posts[0].viewCount, 0);
  assert.equal(posts[0].publishedAt, "2026.09.06");
});

test("빈 공개 목록을 지원하고 잘못된 응답을 거부한다", () => {
  assert.deepEqual(categoryLatestSchema.parse([]), []);
  assert.deepEqual(popularPostsSchema.parse([]), []);
  assert.equal(categoryLatestSchema.safeParse([{ latestPost: null }]).success, false);
  assert.equal(popularPostsSchema.safeParse([{ viewCount: -1 }]).success, false);
});
