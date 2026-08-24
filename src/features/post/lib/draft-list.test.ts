import assert from "node:assert/strict";
import test from "node:test";
import { getDraftLoadAction } from "./draft-list.ts";

test("작성 중인 내용이 있을 때만 임시저장 글 불러오기 확인이 필요하다", () => {
  assert.equal(getDraftLoadAction(true), "confirm");
  assert.equal(getDraftLoadAction(false), "load");
});
