import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const DEFAULT_DESCRIPTION =
  "웹 개발자 박현수의 기술 블로그입니다. 개발하며 배우고 고민한 내용을 기록하고 공유합니다.";

test("초기 문서에 메인 페이지 기본 설명을 제공한다", async () => {
  const html = await readFile(new URL("../../../index.html", import.meta.url), "utf8");

  assert.equal(html.includes('name="description"'), true);
  assert.equal(html.includes(DEFAULT_DESCRIPTION), true);
});

test("게시글 상세 페이지는 게시글 요약을 문서 설명으로 사용한다", async () => {
  const routeSource = await readFile(
    new URL("../../routes/posts/[id].tsx", import.meta.url),
    "utf8",
  );

  assert.equal(routeSource.includes("useDocumentDescription(post?.summary)"), true);
});
