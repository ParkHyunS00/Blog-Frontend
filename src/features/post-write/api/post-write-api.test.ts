import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import {
  createDraft,
  deleteDraft,
  deletePublishedPost,
  fetchDraftList,
  updatePublishedPost,
  uploadPostImage,
} from "./post-write-api.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ status, data, error: null }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("이미지 업로드는 multipart boundary를 브라우저에 맡긴다", async () => {
  let request: Request | undefined;
  globalThis.fetch = async (input, init) => {
    request = new Request(new URL(String(input), "http://localhost"), init);
    return jsonResponse({
      imageId: 12,
      type: "CONTENT",
      objectKey: "key.webp",
      mimeType: "image/webp",
      width: 1536,
      height: 922,
    }, 201);
  };

  const uploaded = await uploadPostImage(new File(["image"], "image.webp", { type: "image/webp" }), "CONTENT");

  assert.equal(new URL(request!.url).pathname, "/api/admin/post-images");
  assert.equal(new URL(request!.url).searchParams.get("type"), "CONTENT");
  assert.match(request!.headers.get("content-type") ?? "", /^multipart\/form-data; boundary=/);
  assert.ok(request!.body);
  assert.equal(uploaded.width, 1536);
  assert.equal(uploaded.height, 922);
});

test("임시저장 목록은 0 기반 페이지를 요청한다", async () => {
  let requestedUrl = "";
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return jsonResponse({
      content: [], page: 2, size: 10, totalElements: 0, totalPages: 0,
      hasNext: false, hasPrevious: true,
    });
  };

  await fetchDraftList(2);

  assert.equal(requestedUrl, "/api/admin/posts/draft?page=2");
});

test("임시저장 생성은 JSON 전체 편집 상태를 전송한다", async () => {
  let request: Request | undefined;
  globalThis.fetch = async (input, init) => {
    request = new Request(new URL(String(input), "http://localhost"), init);
    return jsonResponse({ postId: 15, status: "DRAFT" }, 201);
  };
  const payload = {
    title: "제목", summary: null, content: "<p>본문</p>", categoryName: null,
    tagNames: ["React"], thumbnailImageId: null, contentImageIds: [],
  };

  await createDraft(payload);

  assert.equal(request!.method, "POST");
  assert.equal(new URL(request!.url).pathname, "/api/admin/posts/draft");
  assert.deepEqual(await request!.json(), payload);
});

test("임시저장 삭제는 DELETE 요청을 사용한다", async () => {
  let method = "";
  globalThis.fetch = async (_input, init) => {
    method = init?.method ?? "";
    return jsonResponse(null);
  };

  await deleteDraft(15);
  assert.equal(method, "DELETE");
});

test("공개 게시글 수정은 전체 편집 상태를 PUT 요청으로 전송한다", async () => {
  let request: Request | undefined;
  globalThis.fetch = async (input, init) => {
    request = new Request(new URL(String(input), "http://localhost"), init);
    return jsonResponse({ postId: 15, status: "PUBLISHED" });
  };
  const payload = {
    title: "수정 제목",
    summary: "수정 요약",
    content: '<p>본문</p><img src="/api/post-images/31">',
    categoryName: "Backend",
    tagNames: ["Java"],
    thumbnailImageId: 30,
    contentImageIds: [31],
  };

  await updatePublishedPost(15, payload);

  assert.equal(request!.method, "PUT");
  assert.equal(new URL(request!.url).pathname, "/api/admin/posts/15");
  assert.deepEqual(await request!.json(), payload);
});

test("공개 게시글 삭제는 요청 본문 없이 DELETE 요청을 사용한다", async () => {
  let request: Request | undefined;
  globalThis.fetch = async (input, init) => {
    request = new Request(new URL(String(input), "http://localhost"), init);
    return jsonResponse(null);
  };

  await deletePublishedPost(15);

  assert.equal(request!.method, "DELETE");
  assert.equal(new URL(request!.url).pathname, "/api/admin/posts/15");
  assert.equal(await request!.text(), "");
});
