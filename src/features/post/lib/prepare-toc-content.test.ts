import assert from "node:assert/strict";
import test from "node:test";
import { DOMParser as LinkedomDOMParser } from "linkedom";
import { prepareTocContent } from "./prepare-toc-content.ts";

Object.defineProperty(globalThis, "DOMParser", {
  configurable: true,
  value: LinkedomDOMParser,
});

test("Tiptap이 생성한 ID 없는 h2와 h3에 TOC ID를 추가한다", () => {
  const result = prepareTocContent(
    "<p>소개</p><h2>시작하기</h2><h3>설치 방법</h3>",
  );

  assert.equal(
    result.html,
    '<p>소개</p><h2 id="시작하기">시작하기</h2><h3 id="설치-방법">설치 방법</h3>',
  );
  assert.deepEqual(result.items, [
    { id: "시작하기", text: "시작하기", level: 2 },
    { id: "설치-방법", text: "설치 방법", level: 3 },
  ]);
});

test("기존 heading ID는 유지하고 중복 생성 ID에는 순번을 붙인다", () => {
  const result = prepareTocContent(
    '<h2 id="custom-id">같은 제목</h2><h2>같은 제목</h2><h2>같은 제목</h2>',
  );

  assert.equal(
    result.html,
    '<h2 id="custom-id">같은 제목</h2><h2 id="같은-제목">같은 제목</h2><h2 id="같은-제목-2">같은 제목</h2>',
  );
  assert.deepEqual(result.items, [
    { id: "custom-id", text: "같은 제목", level: 2 },
    { id: "같은-제목", text: "같은 제목", level: 2 },
    { id: "같은-제목-2", text: "같은 제목", level: 2 },
  ]);
});

test("제목 문자가 없는 heading에도 충돌하지 않는 fallback ID를 생성한다", () => {
  const result = prepareTocContent("<h2>!!!</h2><h3>!!!</h3>");

  assert.deepEqual(result.items, [
    { id: "section", text: "!!!", level: 2 },
    { id: "section-2", text: "!!!", level: 3 },
  ]);
});

test("접기 내부 헤딩은 펼침 여부와 중첩 깊이에 관계없이 목차에서 제외한다", () => {
  for (const expanded of ["", " open"]) {
    const result = prepareTocContent(
      `<h2>본문 시작</h2><details data-type="toggle"${expanded}><summary>보충 설명</summary><div data-type="toggle-content"><h2>접기 제목</h2><details data-type="toggle" open><summary>중첩 설명</summary><div data-type="toggle-content"><h3>중첩 제목</h3></div></details></div></details><h3>본문 끝</h3>`,
    );

    assert.deepEqual(result.items, [
      { id: "본문-시작", text: "본문 시작", level: 2 },
      { id: "본문-끝", text: "본문 끝", level: 3 },
    ]);
    const doc = new LinkedomDOMParser().parseFromString(result.html, "text/html");
    assert.equal(doc.querySelector("details h2")?.textContent, "접기 제목");
    assert.equal(doc.querySelector("details details h3")?.textContent, "중첩 제목");
  }
});

test("접기 안에만 헤딩이 있으면 목차가 비어 있고 기존 ID는 보존한다", () => {
  const result = prepareTocContent(
    '<details data-type="toggle"><summary>설명</summary><div data-type="toggle-content"><h2 id="existing">보충 내용</h2></div></details>',
  );
  assert.deepEqual(result.items, []);
  assert.match(result.html, /<h2 id="existing">보충 내용<\/h2>/);
});
