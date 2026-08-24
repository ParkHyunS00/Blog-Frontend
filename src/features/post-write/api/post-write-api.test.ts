import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import {
  createDraft,
  deleteDraft,
  fetchDraftList,
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
    return jsonResponse({ imageId: 12, type: "CONTENT", objectKey: "key.png", mimeType: "image/png" }, 201);
  };

  await uploadPostImage(new File(["image"], "image.png", { type: "image/png" }), "CONTENT");

  assert.equal(new URL(request!.url).pathname, "/api/admin/post-images");
  assert.equal(new URL(request!.url).searchParams.get("type"), "CONTENT");
  assert.match(request!.headers.get("content-type") ?? "", /^multipart\/form-data; boundary=/);
  assert.ok(request!.body);
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
