import assert from "node:assert/strict";
import test from "node:test";
import { insertMathShortcut, mathShortcutGroups } from "./math-shortcuts.ts";
import { renderMath } from "../../../features/post/lib/post-math.ts";
const shortcuts = mathShortcutGroups.flatMap((group) => group.items);
const shortcut = (label: string) => shortcuts.find((item) => item.label === label)!;

test("곱셈 기호는 커서에 넣고 커서를 기호 뒤에 둔다", () => {
  const result = insertMathShortcut("ab", 1, 1, shortcut("곱하기"));
  assert.equal(result.value, "a\\times b");
  assert.equal(result.from, 8);
  assert.equal(result.to, 8);
});
test("선택한 내용을 분자로 감싸고 선택을 유지한다", () => {
  const result = insertMathShortcut("x+a+b=y", 2, 5, shortcut("분수"));
  assert.equal(result.value, "x+\\frac{a+b}{b}=y");
  assert.equal(result.value.slice(result.from, result.to), "a+b");
});
test("빈 위치에 구조를 넣으면 수정할 예시 문자를 선택한다", () => {
  const result = insertMathShortcut("", 0, 0, shortcut("제곱근"));
  assert.equal(result.value, "\\sqrt{x}");
  assert.equal(result.value.slice(result.from, result.to), "x");
});
test("모든 버튼의 기본 수식이 렌더링 가능하다", () => {
  for (const item of shortcuts) {
    assert.doesNotThrow(() => renderMath(insertMathShortcut("", 0, 0, item).value, true), item.label);
  }
});

test("선택한 여러 항 전체에 거듭제곱과 첨자를 적용한다", () => {
  for (const [label, suffix] of [
    ["거듭제곱", "^{2}"],
    ["아래 첨자", "_{n}"],
  ]) {
    const result = insertMathShortcut("a+b", 0, 3, shortcut(label));
    assert.equal(result.value, `\\left(a+b\\right)${suffix}`);
    assert.equal(result.value.slice(result.from, result.to), "a+b");
    assert.doesNotThrow(() => renderMath(result.value, false));
  }
});
