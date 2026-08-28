import assert from "node:assert/strict";
import test from "node:test";
import { DOMParser as LinkedomDOMParser } from "linkedom";
import { optimizePostContentImages } from "./optimize-post-content-images.ts";

Object.defineProperty(globalThis, "DOMParser", {
  configurable: true,
  value: LinkedomDOMParser,
});

function parseImages(html: string): Element[] {
  const document = new DOMParser().parseFromString(
    `<!doctype html><html><body>${html}</body></html>`,
    "text/html",
  );
  return Array.from(document.body.querySelectorAll("img"));
}

test("본문의 첫 이미지는 LCP 후보로 우선 로딩한다", () => {
  const [image] = parseImages(
    optimizePostContentImages('<p>본문</p><img src="/api/post-images/1" loading="lazy">'),
  );

  assert.equal(image.getAttribute("loading"), "eager");
  assert.equal(image.getAttribute("fetchpriority"), "high");
  assert.equal(image.getAttribute("decoding"), "async");
});

test("두 번째 이후 이미지는 지연 로딩하고 낮은 우선순위를 사용한다", () => {
  const source = Array.from(
    { length: 10 },
    (_, index) => `<img src="/api/post-images/${index + 1}" loading="eager" fetchpriority="high">`,
  ).join("");
  const images = parseImages(optimizePostContentImages(source));

  assert.equal(images.length, 10);
  assert.equal(images[0].getAttribute("loading"), "eager");
  assert.equal(images[0].getAttribute("fetchpriority"), "high");

  for (const image of images.slice(1)) {
    assert.equal(image.getAttribute("loading"), "lazy");
    assert.equal(image.getAttribute("fetchpriority"), "low");
    assert.equal(image.getAttribute("decoding"), "async");
  }
});

test("이미지가 없는 본문은 내용을 변경하지 않는다", () => {
  const html = "<p>이미지가 없는 본문입니다.</p>";

  assert.equal(optimizePostContentImages(html), html);
});
