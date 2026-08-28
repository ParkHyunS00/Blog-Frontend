import assert from "node:assert/strict";
import test from "node:test";
import { getAvailableTagSuggestions } from "./tag-input-options.ts";

test("입력값이 없으면 아직 선택하지 않은 태그 목록을 모두 반환한다", () => {
  assert.deepEqual(
    getAvailableTagSuggestions(["React", "TypeScript", "CSS"], ["CSS"], ""),
    ["React", "TypeScript"],
  );
});

test("입력값이 있으면 대소문자 구분 없이 태그 목록을 필터링한다", () => {
  assert.deepEqual(
    getAvailableTagSuggestions(["React", "TypeScript", "CSS"], [], "type"),
    ["TypeScript"],
  );
});
