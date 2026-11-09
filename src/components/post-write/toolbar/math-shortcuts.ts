export type MathShortcut = {
  label: string;
  symbol: string;
  before: string;
  placeholder?: string;
  after?: string;
  groupSelection?: boolean;
};

export const mathShortcutGroups: { label: string; items: MathShortcut[] }[] = [
  {
    label: "연산·비교",
    items: [
      { label: "곱하기", symbol: "×", before: "\\times " },
      { label: "가운데 점 곱하기", symbol: "·", before: "\\cdot " },
      { label: "나누기", symbol: "÷", before: "\\div " },
      { label: "플러스 마이너스", symbol: "±", before: "\\pm " },
      { label: "같음", symbol: "=", before: "=" },
      { label: "같지 않음", symbol: "≠", before: "\\neq " },
      { label: "작거나 같음", symbol: "≤", before: "\\leq " },
      { label: "크거나 같음", symbol: "≥", before: "\\geq " },
      { label: "거의 같음", symbol: "≈", before: "\\approx " },
    ],
  },
  {
    label: "수식 구조",
    items: [
      { label: "분수", symbol: "a/b", before: "\\frac{", placeholder: "a", after: "}{b}" },
      { label: "거듭제곱", symbol: "xⁿ", before: "", placeholder: "x", after: "^{2}", groupSelection: true },
      { label: "아래 첨자", symbol: "xₙ", before: "", placeholder: "x", after: "_{n}", groupSelection: true },
      { label: "제곱근", symbol: "√x", before: "\\sqrt{", placeholder: "x", after: "}" },
      { label: "괄호", symbol: "(x)", before: "\\left(", placeholder: "x", after: "\\right)" },
      { label: "합계", symbol: "∑", before: "\\sum_{i=1}^{n} ", placeholder: "x_i" },
      { label: "적분", symbol: "∫", before: "\\int_{a}^{b} ", placeholder: "x", after: "\\,dx" },
      { label: "극한", symbol: "lim", before: "\\lim_{x \\to 0} ", placeholder: "f(x)" },
    ],
  },
  {
    label: "기호",
    items: [
      { label: "파이", symbol: "π", before: "\\pi " },
      { label: "무한대", symbol: "∞", before: "\\infty " },
      { label: "알파", symbol: "α", before: "\\alpha " },
      { label: "베타", symbol: "β", before: "\\beta " },
      { label: "세타", symbol: "θ", before: "\\theta " },
      { label: "델타", symbol: "Δ", before: "\\Delta " },
      { label: "화살표", symbol: "→", before: "\\to " },
    ],
  },
];

export function insertMathShortcut(value: string, from: number, to: number, shortcut: MathShortcut) {
  const selected = value.slice(from, to);
  const body = shortcut.placeholder === undefined ? "" : selected || shortcut.placeholder;
  const grouped = !!selected && !!shortcut.groupSelection;
  const prefix = shortcut.before + (grouped ? "\\left(" : "");
  const suffix = (grouped ? "\\right)" : "") + (shortcut.after || "");
  const inserted = prefix + body + suffix;
  const start = from + prefix.length;
  return {
    value: value.slice(0, from) + inserted + value.slice(to),
    from: body ? start : from + inserted.length,
    to: body ? start + body.length : from + inserted.length,
  };
}
