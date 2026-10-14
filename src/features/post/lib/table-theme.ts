export const TABLE_THEMES = [
  { value: "default", label: "기본" },
  { value: "striped", label: "줄무늬" },
  { value: "minimal", label: "미니멀" },
] as const;

export type TableTheme = (typeof TABLE_THEMES)[number]["value"];

export function normalizeTableTheme(value: unknown): TableTheme {
  return TABLE_THEMES.find((theme) => theme.value === value)?.value ?? "default";
}
