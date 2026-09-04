import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { DOMParser as LinkedomDOMParser } from "linkedom";
import { createServer } from "vite";

test("조회수, 카테고리, 날짜를 하나의 정보 행에 표시한다", async () => {
  const vite = await createServer({
    appType: "custom",
    optimizeDeps: { noDiscovery: true },
    server: { hmr: false, middlewareMode: true, ws: false },
  });

  try {
    const module = await vite.ssrLoadModule(
      "/src/components/post-detail/post-detail-header.tsx",
    );
    const html = renderToStaticMarkup(
      module.PostDetailHeader({
        title: "게시글 제목",
        category: "Backend",
        createdAt: "2026.09.04",
        viewCount: 1234,
      }),
    );
    const document = new LinkedomDOMParser().parseFromString(html, "text/html");
    const metadata = document.querySelector('[aria-label="게시글 정보"]');

    assert.ok(metadata);
    assert.match(metadata.textContent, /조회수/);
    assert.match(metadata.textContent, /1,234/);
    assert.match(metadata.textContent, /Backend/);
    assert.match(metadata.textContent, /2026\.09\.04/);
    assert.equal(document.querySelectorAll('[role="group"]').length, 1);
  } finally {
    await vite.close();
  }
});
