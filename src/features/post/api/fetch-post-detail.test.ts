import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import * as postDetailApi from "./fetch-post-detail.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("공개 상세 조회 한 번으로 조회수가 반영된 게시글을 반환한다", async () => {
  assert.equal("recordPostView" in postDetailApi, false);

  const requests: Request[] = [];
  globalThis.fetch = async (input, init) => {
    requests.push(
      new Request(new URL(String(input), "http://localhost"), init),
    );
    return new Response(
      JSON.stringify({
        status: 200,
        data: {
          postId: 1,
          title: "Spring Security 정리",
          summary: "세션 인증 흐름을 정리합니다.",
          content: "<p>본문</p>",
          viewCount: 129,
          thumbnailImageId: null,
          categoryName: "Backend",
          categorySlug: "backend",
          tags: [],
          contentImageIds: [],
          createdAt: "2026-08-13T12:00:00",
          updatedAt: "2026-08-13T12:30:00",
        },
        error: null,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };

  const result = await postDetailApi.fetchPostDetail(1);

  assert.equal(result.viewCount, 129);
  assert.equal(requests.length, 1);
  const [request] = requests;
  assert.equal(new URL(request.url).pathname, "/api/posts/1");
  assert.equal(request.method, "GET");
  assert.equal(request.credentials, "include");
});
