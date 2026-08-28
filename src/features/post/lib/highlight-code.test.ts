import assert from "node:assert/strict";
import test from "node:test";
import { processCodeBlocks } from "./highlight-code.ts";

test("코드 블록의 nbsp 엔티티를 공백으로 디코딩한 뒤 강조한다", () => {
  const result = processCodeBlocks(
    '<pre><code class="language-javascript">&nbsp;&nbsp;&nbsp;&nbsp;const value = 1;</code></pre>',
  );

  assert.equal(result.includes("nbsp"), false);
  assert.match(result, /<code class="hljs">\s{4}/);
});
