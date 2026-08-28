export function getDraftLoadAction(hasUnsavedContent: boolean): "confirm" | "load" {
  return hasUnsavedContent ? "confirm" : "load";
}
