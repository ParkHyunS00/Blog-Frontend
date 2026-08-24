import assert from "node:assert/strict";
import test from "node:test";
import { diffImageIds, extractContentImageIds } from "./post-image-ids.ts";

test("본문의 상대 이미지 URL에서 중복 없는 ID를 문서 순서대로 추출한다", () => {
  const html = '<img src="/api/post-images/12"><img src="https://x/1"><img src="/api/post-images/13"><img src="/api/post-images/12"><img src="data:image/png;base64,x">';
  assert.deepEqual(extractContentImageIds(html), [12, 13]);
});

test("이전 이미지 중 현재 HTML에서 제거된 ID를 계산한다", () => {
  assert.deepEqual(diffImageIds([12, 13, 14], [13, 15]), [12, 14]);
});
