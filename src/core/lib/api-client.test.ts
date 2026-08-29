import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { z } from "zod";
import { apiRequest } from "./api-client.ts";
import * as csrfModule from "./csrf.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  (csrfModule as typeof csrfModule & { clearCsrfToken?: () => void }).clearCsrfToken?.();
});

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ status, data, error: null }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("변경 요청 전에 CSRF 토큰을 자동 발급하고 응답의 헤더 이름으로 전달한다", async () => {
  const requests: Request[] = [];
  globalThis.fetch = async (input, init) => {
    const request = new Request(new URL(String(input), "http://localhost"), init);
    requests.push(request);

    if (new URL(request.url).pathname === "/api/admin/csrf") {
      return jsonResponse({ token: "xor-token", headerName: "X-XSRF-TOKEN" });
    }
    return jsonResponse(null);
  };

  await apiRequest("/api/admin/test", { method: "POST" }, z.null());

  assert.equal(requests.length, 2);
  assert.equal(new URL(requests[0].url).pathname, "/api/admin/csrf");
  assert.equal(requests[0].credentials, "include");
  assert.equal(new URL(requests[1].url).pathname, "/api/admin/test");
  assert.equal(requests[1].headers.get("X-XSRF-TOKEN"), "xor-token");
  assert.equal(requests[1].credentials, "include");
});

test("조회 요청은 CSRF 토큰을 발급하지 않는다", async () => {
  const requestedPaths: string[] = [];
  globalThis.fetch = async (input, init) => {
    const request = new Request(new URL(String(input), "http://localhost"), init);
    requestedPaths.push(new URL(request.url).pathname);
    return jsonResponse(null);
  };

  await apiRequest("/api/public/test", { method: "GET" }, z.null());

  assert.deepEqual(requestedPaths, ["/api/public/test"]);
});
