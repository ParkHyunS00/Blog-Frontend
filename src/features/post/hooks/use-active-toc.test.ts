import assert from "node:assert/strict";
import test from "node:test";
import { resolveActiveTocId } from "./use-active-toc.ts";

test("마지막 헤딩이 화면 아래에 함께 보여도 상단 기준선을 지난 항목을 유지한다", () => {
  const activeId = resolveActiveTocId(
    [
      { id: "theme-change", top: 90 },
      { id: "auto-theme-switch", top: 360 },
      { id: "claude-code-experience", top: 620 },
      { id: "conclusion", top: 760 },
    ],
    { topOffset: 100 },
  );

  assert.equal(activeId, "theme-change");
});

test("마지막 헤딩이 화면 밖이면 상단 기준선을 지난 가장 가까운 항목을 유지한다", () => {
  const activeId = resolveActiveTocId(
    [
      { id: "first", top: -300 },
      { id: "second", top: 80 },
      { id: "last", top: 820 },
    ],
    { topOffset: 100 },
  );

  assert.equal(activeId, "second");
});

test("현재 헤딩이 기준선 근처에서 흔들려도 바로 이전 항목으로 돌아가지 않는다", () => {
  const activeId = resolveActiveTocId(
    [
      { id: "claude-code-experience", top: -240 },
      { id: "copilot-cli-experience", top: 110 },
      { id: "conclusion", top: 640 },
    ],
    {
      topOffset: 100,
      previousActiveId: "copilot-cli-experience",
      scrollEndDistance: 400,
    },
  );

  assert.equal(activeId, "copilot-cli-experience");
});

test("실제 스크롤 끝에 도달하면 마지막 헤딩을 활성화한다", () => {
  const activeId = resolveActiveTocId(
    [
      { id: "copilot-cli-experience", top: -200 },
      { id: "conclusion", top: 420 },
    ],
    {
      topOffset: 100,
      previousActiveId: "copilot-cli-experience",
      scrollEndDistance: 0,
    },
  );

  assert.equal(activeId, "conclusion");
});

test("결론이 화면에 보여도 스크롤 끝이 아니면 상단 기준 항목으로 이동한다", () => {
  const activeId = resolveActiveTocId(
    [
      { id: "claude-code-experience", top: 80 },
      { id: "copilot-cli-experience", top: 360 },
      { id: "conclusion", top: 680 },
    ],
    {
      topOffset: 100,
      previousActiveId: "conclusion",
      scrollEndDistance: 200,
    },
  );

  assert.equal(activeId, "claude-code-experience");
});
