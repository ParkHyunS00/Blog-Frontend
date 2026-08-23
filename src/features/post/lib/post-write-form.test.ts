import assert from "node:assert/strict";
import test from "node:test";
import { hasPostWriteContent } from "./post-write-form.ts";
import type { PostWriteForm } from "../types/post-write.types.ts";

const emptyForm: PostWriteForm = {
  title: "",
  summary: "",
  thumbnailFile: null,
  thumbnailUrl: "",
  category: "",
  tags: [],
  content: "<p></p><p><br></p>",
};

test("텍스트가 없는 Tiptap 기본 마크업은 작성 중인 내용으로 보지 않는다", () => {
  assert.equal(hasPostWriteContent(emptyForm), false);
});

test("제목이나 메타데이터가 입력되면 작성 중인 글로 판단한다", () => {
  assert.equal(hasPostWriteContent({ ...emptyForm, title: "작성 중" }), true);
  assert.equal(hasPostWriteContent({ ...emptyForm, tags: ["React"] }), true);
});

test("본문에 텍스트 또는 이미지만 있어도 작성 중인 글로 판단한다", () => {
  assert.equal(hasPostWriteContent({ ...emptyForm, content: "<p>본문</p>" }), true);
  assert.equal(hasPostWriteContent({ ...emptyForm, content: '<p><img src="image.png"></p>' }), true);
});
