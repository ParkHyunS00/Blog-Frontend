import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createServer } from "vite";

test("게시글 탐색 페이지는 태그, 카테고리별 최신 글, 인기 글 영역을 제공한다", async (context) => {
  const vite = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });
  context.after(() => vite.close());
  const { PostsPage } = await vite.ssrLoadModule("/src/routes/posts/index.tsx");
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["tags", "list"], [{ tagId: 1, name: "Java", slug: "java" }]);
  queryClient.setQueryData(
    ["categories", "latest-posts"],
    [
      {
        category: "Backend",
        categorySlug: "backend",
        title: "최신 글",
        summary: "요약",
        postCount: 8,
        updatedAt: "2026.09.06",
      },
    ],
  );
  queryClient.setQueryData(
    ["posts", "popular"],
    [
      {
        id: 101,
        title: "좋은 코드란 무엇일까?",
        category: "Backend",
        publishedAt: "2026.09.06",
        viewCount: 12400,
      },
      {
        id: 102,
        title: "두 번째 글",
        category: "Backend",
        publishedAt: "2026.09.05",
        viewCount: 800,
      },
      {
        id: 103,
        title: "세 번째 글",
        category: "Backend",
        publishedAt: "2026.09.04",
        viewCount: 0,
      },
    ],
  );
  context.after(() => queryClient.clear());

  const markup = renderToStaticMarkup(
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(MemoryRouter, null, React.createElement(PostsPage)),
    ),
  );

  assert.doesNotMatch(markup, /관심사를 따라 기록을 탐색해보세요/);
  assert.doesNotMatch(markup, /태그로 찾기/);
  assert.doesNotMatch(markup, /하나의 키워드에서 시작해보세요/);
  assert.match(markup, />TAGS</);
  assert.match(markup, /px-4 pt-12 pb-10 sm:pt-16 sm:pb-14/);
  assert.match(markup, /space-y-16 sm:space-y-20/);
  assert.doesNotMatch(markup, /mt-20 sm:mt-24/);
  assert.match(markup, /Java/);
  assert.match(markup, /bg-secondary/);
  assert.doesNotMatch(markup, /px-4 py-2 text-sm border border-\[#305CEC\]/);
  assert.match(markup, />LATEST BY CATEGORY</);
  assert.doesNotMatch(markup, /absolute inset-x-0 top-0 h-0\.5 opacity-80/);
  assert.doesNotMatch(markup, /카테고리별 최신 기록/);
  assert.doesNotMatch(markup, />LATEST<\/span>/);
  assert.match(markup, />MOST READ</);
  assert.doesNotMatch(markup, /많이 읽은 기록/);
  assert.doesNotMatch(markup, /지금 독자들이 가장 많이 찾는 글이에요/);
  assert.match(markup, /12\.4K/);
  assert.doesNotMatch(markup, /12,400/);
  assert.doesNotMatch(markup, />01</);
  assert.doesNotMatch(markup, />02</);
  assert.doesNotMatch(markup, />03</);
  assert.match(markup, /href="\/posts\/101"/);
  assert.match(markup, /href="\/posts\/102"/);
  assert.match(markup, /href="\/posts\/103"/);
  assert.match(markup, /Backend/);
  assert.match(markup, /좋은 코드란 무엇일까/);
});
