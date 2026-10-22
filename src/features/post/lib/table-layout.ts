export type TableLayout = "auto" | "equal";

export function normalizeTableLayout(value: unknown): TableLayout {
  return value === "equal" ? "equal" : "auto";
}

export const TABLE_CELL_MIN_WIDTH = 128;
