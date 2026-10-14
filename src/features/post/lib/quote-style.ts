export const QUOTE_STYLES = [
  { value: "default", label: "기본 인용", description: "일반적인 인용 문구" },
  { value: "note", label: "Note", description: "알아두면 좋은 정보" },
  { value: "tip", label: "Tip", description: "도움이 되는 팁" },
  { value: "important", label: "Important", description: "꼭 알아야 할 중요 정보" },
  { value: "warning", label: "Warning", description: "주의가 필요한 내용" },
  { value: "caution", label: "Caution", description: "위험이나 부정적인 결과 안내" },
] as const;

export type QuoteStyle = (typeof QUOTE_STYLES)[number]["value"];

export function normalizeQuoteStyle(value: unknown): QuoteStyle {
  return QUOTE_STYLES.find((style) => style.value === value)?.value ?? "default";
}
