import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("CSRF 토큰은 창 포커스나 네트워크 재연결로 임의 갱신하지 않는다", async () => {
  const source = await readFile(new URL("./use-csrf.ts", import.meta.url), "utf8");

  assert.equal(source.includes("refetchOnWindowFocus: false"), true);
  assert.equal(source.includes("refetchOnReconnect: false"), true);
});
