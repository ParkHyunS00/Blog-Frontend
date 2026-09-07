import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const LAZY_ROUTE_MODULES = [
  "@/routes/posts/index",
  "@/routes/posts/[id]",
  "@/routes/posts/write",
  "@/routes/admin/index",
] as const;

test("홈은 즉시 로딩하고 나머지 페이지 라우트는 초기 번들과 분리한다", async () => {
  const appSource = await readFile(new URL("./App.tsx", import.meta.url), "utf8");

  assert.match(appSource, /import \{ HomePage \} from "@\/routes\/index";/);
  assert.equal(appSource.includes('import("@/routes/index")'), false);

  for (const routeModule of LAZY_ROUTE_MODULES) {
    assert.equal(
      appSource.includes(`import("${routeModule}")`),
      true,
      `${routeModule}에 대한 동적 import가 필요합니다.`,
    );
  }
});
