import assert from "node:assert/strict";
import test from "node:test";
import {
  clampDraftPage,
  DRAFTS_PER_PAGE,
  getDraftPage,
  getDraftLoadAction,
  getDraftTotalPages,
  removeDraftById,
} from "./draft-list.ts";
import type { Draft } from "../types/draft.types.ts";

const drafts: Draft[] = [
  {
    id: "draft-1",
    title: "첫 번째 초안",
    category: "Frontend",
    tags: [],
    content: "<p>첫 번째 내용</p>",
    savedAt: "2026-08-23T10:00:00",
  },
  {
    id: "draft-2",
    title: "두 번째 초안",
    category: "Backend",
    tags: ["Java"],
    content: "<p>두 번째 내용</p>",
    savedAt: "2026-08-23T11:00:00",
  },
];

test("선택한 임시저장 글만 목록에서 제거한다", () => {
  const result = removeDraftById(drafts, "draft-1");

  assert.deepEqual(result, [drafts[1]]);
  assert.equal(drafts.length, 2);
});

test("존재하지 않는 ID를 삭제하면 기존 목록을 유지한다", () => {
  const result = removeDraftById(drafts, "missing");

  assert.deepEqual(result, drafts);
});

test("임시저장 목록을 요청한 페이지 크기로 나눈다", () => {
  const manyDrafts = Array.from({ length: 10 }, (_, index) => ({
    ...drafts[0],
    id: `draft-${index + 1}`,
  }));

  assert.equal(getDraftTotalPages(manyDrafts.length, 4), 3);
  assert.deepEqual(
    getDraftPage(manyDrafts, 2, 4).map((draft) => draft.id),
    ["draft-5", "draft-6", "draft-7", "draft-8"],
  );
});

test("임시저장 목록은 한 페이지에 10개를 표시한다", () => {
  assert.equal(DRAFTS_PER_PAGE, 10);
  assert.equal(getDraftTotalPages(21, DRAFTS_PER_PAGE), 3);
});

test("삭제 후 현재 페이지가 범위를 벗어나면 마지막 페이지로 보정한다", () => {
  assert.equal(clampDraftPage(3, 2), 2);
  assert.equal(clampDraftPage(1, 0), 1);
});

test("작성 중인 내용이 있을 때만 임시저장 글 불러오기 확인이 필요하다", () => {
  assert.equal(getDraftLoadAction(true), "confirm");
  assert.equal(getDraftLoadAction(false), "load");
});
