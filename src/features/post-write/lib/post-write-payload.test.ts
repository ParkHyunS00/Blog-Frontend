import assert from "node:assert/strict";
import test from "node:test";
import { toPublishPostPayload, toSaveDraftPayload } from "./post-write-payload.ts";
import type { PostWriteForm } from "../../post/types/post-write.types.ts";

const form: PostWriteForm = {
  title: " 제목 ",
  summary: "",
  thumbnailFile: null,
  thumbnailUrl: "",
  thumbnailImageId: null,
  category: "",
  tags: ["React"],
  content: '<p>본문</p><img src="/api/post-images/12">',
  contentImageIds: [99],
};

test("임시저장 payload는 빈 선택 필드를 null로 정규화하고 HTML 이미지 ID를 사용한다", () => {
  assert.deepEqual(toSaveDraftPayload(form), {
    title: "제목",
    summary: null,
    content: '<p>본문</p><img src="/api/post-images/12">',
    categoryName: null,
    tagNames: ["React"],
    thumbnailImageId: null,
    contentImageIds: [12],
  });
});

test("발행 payload는 필수값이 없으면 필드 오류를 반환한다", () => {
  const result = toPublishPostPayload(form);
  assert.equal(result.success, false);
  if (!result.success)
    assert.deepEqual(result.errors, { summary: "요약을 입력해주세요.", category: "카테고리를 선택해주세요." });
});

test("인라인 또는 블록 수식만 있어도 발행할 수 있다", () => {
  for (const content of [
    '<p><span data-type="inline-math" data-latex="x^2"></span></p>',
    '<div data-latex="x &gt; 1" data-type="block-math"></div>',
  ]) {
    assert.equal(
      toPublishPostPayload({ ...form, title: "제목", summary: "요약", category: "개발", content }).success,
      true,
    );
  }
});
test("비어 있거나 잘못된 수식 노드는 본문으로 인정하지 않는다", () => {
  for (const content of [
    '<span data-type="inline-math" data-latex="  "></span>',
    '<div data-type="wrong" data-latex="x"></div>',
    '<span data-latex="x"></span>',
  ]) {
    assert.equal(
      toPublishPostPayload({ ...form, title: "제목", summary: "요약", category: "개발", content }).success,
      false,
    );
  }
});
