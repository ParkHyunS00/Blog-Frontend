import type { Draft } from "@/features/post/types/draft.types";

export const DRAFTS_PER_PAGE = 10;

export function getDraftLoadAction(hasUnsavedContent: boolean): "confirm" | "load" {
  return hasUnsavedContent ? "confirm" : "load";
}

export function removeDraftById(drafts: Draft[], draftId: string): Draft[] {
  return drafts.filter((draft) => draft.id !== draftId);
}

export function getDraftTotalPages(draftCount: number, pageSize: number): number {
  return Math.ceil(draftCount / pageSize);
}

export function getDraftPage(drafts: Draft[], page: number, pageSize: number): Draft[] {
  const startIndex = (page - 1) * pageSize;
  return drafts.slice(startIndex, startIndex + pageSize);
}

export function clampDraftPage(page: number, totalPages: number): number {
  return Math.min(page, Math.max(totalPages, 1));
}
