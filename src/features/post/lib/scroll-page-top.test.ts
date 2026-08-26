import assert from "node:assert/strict";
import test from "node:test";
import { scrollPageToTop } from "./scroll-page-top.ts";

test("게시글 상세 진입 시 가로와 세로 스크롤을 즉시 최상단으로 이동한다", () => {
  let receivedOptions: ScrollToOptions | undefined;
  const scrollTarget = {
    scrollTo(options: ScrollToOptions) {
      receivedOptions = options;
    },
  };

  scrollPageToTop(scrollTarget);

  assert.deepEqual(receivedOptions, { top: 0, left: 0, behavior: "auto" });
});
