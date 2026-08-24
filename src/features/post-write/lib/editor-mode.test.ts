import assert from "node:assert/strict";
import test from "node:test";
import { resolveEditorMode } from "./editor-mode.ts";

test("새 글 작성 모드는 게시글 ID 없이 생성한다", () => {
  assert.deepEqual(resolveEditorMode("CREATE", undefined), { type: "CREATE" });
});

test("임시저장과 공개 글 수정 모드는 양의 정수 ID를 사용한다", () => {
  assert.deepEqual(resolveEditorMode("EDIT_DRAFT", "12"), { type: "EDIT_DRAFT", draftId: 12 });
  assert.deepEqual(resolveEditorMode("EDIT_PUBLISHED", "34"), { type: "EDIT_PUBLISHED", postId: 34 });
});

test("수정 모드의 잘못된 게시글 ID를 거부한다", () => {
  assert.equal(resolveEditorMode("EDIT_DRAFT", undefined), null);
  assert.equal(resolveEditorMode("EDIT_DRAFT", "0"), null);
  assert.equal(resolveEditorMode("EDIT_PUBLISHED", "1.5"), null);
  assert.equal(resolveEditorMode("EDIT_PUBLISHED", "invalid"), null);
});
