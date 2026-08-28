export type EditorMode =
  | { type: "CREATE" }
  | { type: "EDIT_DRAFT"; draftId: number }
  | { type: "EDIT_PUBLISHED"; postId: number };

export type EditorModeType = EditorMode["type"];

export function resolveEditorMode(
  type: EditorModeType,
  rawPostId: string | undefined,
): EditorMode | null {
  if (type === "CREATE") return { type: "CREATE" };

  const postId = Number(rawPostId);
  if (!Number.isInteger(postId) || postId <= 0) return null;

  return type === "EDIT_DRAFT"
    ? { type: "EDIT_DRAFT", draftId: postId }
    : { type: "EDIT_PUBLISHED", postId };
}
