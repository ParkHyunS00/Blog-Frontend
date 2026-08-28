import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readRobotsTxt(): Promise<string> {
  try {
    return await readFile(new URL("../../../public/robots.txt", import.meta.url), "utf8");
  } catch {
    return "";
  }
}

test("공개 페이지는 허용하고 관리자 경로는 크롤링에서 제외한다", async () => {
  const robots = await readRobotsTxt();

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Disallow: \/admin$/m);
});
