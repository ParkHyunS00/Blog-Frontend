import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { createVisitorStatsLoader, visitorStatsSchema } from "./visitor.ts";
import { clearCsrfToken } from "../../../core/lib/csrf.ts";

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
  clearCsrfToken();
});
const response = (data: unknown) => Response.json({ status: 200, data, error: null });

test("CSRF 발급과 방문 기록 후 통계를 조회하고 서버 숫자를 그대로 사용한다", async () => {
  const calls: string[] = [];
  globalThis.fetch = async (input, init) => {
    const path = String(input);
    calls.push((init?.method ?? "GET") + " " + path);
    assert.equal(init?.credentials, "include");
    if (path.endsWith("/csrf")) return response({ token: "token", headerName: "X-XSRF-TOKEN" });
    if (init?.method === "POST") {
      assert.equal(new Headers(init.headers).get("X-XSRF-TOKEN"), "token");
      assert.equal(init.body, undefined);
      return response(null);
    }
    return response({ total: 150, today: 12, yesterday: 18 });
  };
  const load = createVisitorStatsLoader();
  assert.deepEqual(await load(), { total: 150, today: 12, yesterday: 18 });
  await load();
  assert.deepEqual(calls, ["GET /api/admin/csrf", "POST /api/visitors", "GET /api/visitors", "GET /api/visitors"]);
});

test("동시에 호출해도 방문 POST는 한 번만 보낸다", async () => {
  let writes = 0;
  globalThis.fetch = async (input, init) => {
    if (String(input).endsWith("/csrf")) return response({ token: "token", headerName: "X-XSRF-TOKEN" });
    if (init?.method === "POST") {
      writes++;
      return response(null);
    }
    return response({ total: 0, today: 0, yesterday: 0 });
  };
  const load = createVisitorStatsLoader();
  await Promise.all([load(), load()]);
  assert.equal(writes, 1);
});

test("방문 기록 실패 시 통계를 먼저 조회하지 않고 재시도할 수 있다", async () => {
  let writes = 0;
  let reads = 0;
  globalThis.fetch = async (input, init) => {
    if (String(input).endsWith("/csrf")) return response({ token: "token", headerName: "X-XSRF-TOKEN" });
    if (init?.method === "POST") {
      writes++;
      if (writes === 1) return new Response("Forbidden", { status: 403 });
      return response(null);
    }
    reads++;
    return response({ total: 0, today: 0, yesterday: 0 });
  };
  const load = createVisitorStatsLoader();
  await assert.rejects(load());
  assert.equal(reads, 0);
  await load();
  assert.equal(writes, 2);
  assert.equal(reads, 1);
});

test("집계 0은 허용하고 음수와 소수는 거부한다", () => {
  assert.equal(visitorStatsSchema.safeParse({ total: 0, today: 0, yesterday: 0 }).success, true);
  assert.equal(visitorStatsSchema.safeParse({ total: -1, today: 0, yesterday: 0 }).success, false);
  assert.equal(visitorStatsSchema.safeParse({ total: 1.5, today: 0, yesterday: 0 }).success, false);
});
