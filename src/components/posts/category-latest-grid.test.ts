import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { parseHTML } from "linkedom";
import { createServer } from "vite";

test("더 보기는 카테고리를 6개씩 펼치고 마지막에 사라진다", async () => {
  const vite = await createServer({
    appType: "custom",
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  const globals = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  const previous = {
    window: globals.window,
    document: globals.document,
    act: globals.IS_REACT_ACT_ENVIRONMENT,
  };
  const { window } = parseHTML("<html><body><div id='root'></div></body></html>");
  Object.assign(globals, {
    window,
    document: window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  const container = window.document.getElementById("root")!;
  const root = createRoot(container);
  try {
    const { CategoryLatestGrid } = await vite.ssrLoadModule("/src/components/posts/category-latest-grid.tsx");
    const posts = Array.from({ length: 15 }, (_, i) => ({
      category: "카테고리 " + i,
      categorySlug: "category-" + i,
      title: "최신 글 " + i,
      summary: "요약",
      postCount: 1,
      updatedAt: "2026.09.06",
    }));
    await act(async () => {
      root.render(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(CategoryLatestGrid, {
            posts,
            isLoading: false,
            isError: false,
            onRetry: () => {},
          }),
        ),
      );
    });
    const cardCount = () => container.querySelectorAll("#category-latest-cards > a").length;
    assert.equal(cardCount(), 6);
    await act(async () => {
      container.querySelector("button")!.click();
    });
    assert.equal(cardCount(), 12);
    await act(async () => {
      container.querySelector("button")!.click();
    });
    assert.equal(cardCount(), 15);
    assert.equal(container.querySelector("button"), null);
    assert.equal(container.querySelector("#category-latest-cards > a")!.getAttribute("href"), "/?category=category-0");
  } finally {
    await act(async () => {
      root.unmount();
    });
    Object.assign(globals, {
      window: previous.window,
      document: previous.document,
      IS_REACT_ACT_ENVIRONMENT: previous.act,
    });
    await vite.close();
  }
});
