import assert from "node:assert/strict";
import test from "node:test";
import { parseHTML } from "linkedom";
import { DOMParser, DOMSerializer } from "@tiptap/pm/model";
import { getSchema } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Mathematics } from "@tiptap/extension-mathematics";
import { renderMath, renderPostMath } from "./post-math.ts";

const { document } = parseHTML("<html><body></body></html>");
Object.defineProperty(globalThis, "document", { value: document, configurable: true });

test("인라인·블록 수식의 원문을 HTML 저장 후 다시 읽을 수 있다", () => {
  const schema = getSchema([StarterKit, Mathematics]);
  const latex = String.raw`\frac{a}{b} < x & y`;
  const doc = schema.node("doc", null, [
    schema.node("paragraph", null, [schema.text("수식 "), schema.node("inlineMath", { latex })]),
    schema.node("blockMath", { latex: String.raw`\sum_{i=1}^{n} i` }),
  ]);
  const container = document.createElement("div");
  container.append(
    DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document: document as unknown as Document }),
  );
  assert.match(container.innerHTML, /data-type="inline-math"/);
  assert.match(container.innerHTML, /data-type="block-math"/);
  assert.deepEqual(
    DOMParser.fromSchema(schema)
      .parse(container as unknown as HTMLElement)
      .toJSON(),
    doc.toJSON(),
  );
});

test("상세페이지는 보존된 수식 속성만 렌더링하고 일반 달러 문구는 유지한다", () => {
  const result = renderPostMath(
    '<p>$10, $20</p><span data-type="inline-math" data-latex="x^2"></span><div data-type="block-math" data-latex="x^2"></div>',
  );
  assert.match(result, /class="katex"/);
  assert.match(result, /katex-display/);
  assert.match(result, /\$10, \$20/);
  assert.equal(renderPostMath('<span data-latex="x^2">원문</span>'), '<span data-latex="x^2">원문</span>');
});

test("잘못된 수식은 안전한 텍스트로 남고 다른 본문은 계속 표시된다", () => {
  const result = renderPostMath(
    '<div data-type="block-math" data-latex="\\unknown{&lt;img src=x onerror=alert(1)&gt;}"></div><p>다음 본문</p>',
  );
  assert.match(result, /math-error/);
  const container = document.createElement("div");
  container.innerHTML = result;
  assert.equal(container.querySelector("img"), null);
  assert.match(result, /다음 본문/);
  assert.throws(() => renderMath("x".repeat(5001), true));
});

test("수식으로 링크·HTML·이미지 삽입을 실행하지 않는다", () => {
  for (const latex of [
    String.raw`\href{javascript:alert(1)}{click}`,
    String.raw`\includegraphics{https://example.com/a.png}`,
    String.raw`\htmlClass{injected}{x}`,
  ]) {
    let html: string;
    try {
      html = renderMath(latex, false);
    } catch {
      continue;
    }
    assert.doesNotMatch(html, /<a\b|<img\b|class="injected"/);
  }
});
