import type { PostWriteForm } from "../../post/types/post-write.types.ts";
import type { PublishPostPayload, SaveDraftPayload } from "../types/post-write-api.types.ts";
import { extractContentImageIds } from "./post-image-ids.ts";

type PublishFieldErrors = Partial<Record<"title" | "summary" | "content" | "category", string>>;
type PublishPayloadResult =
  | { success: true; payload: PublishPostPayload }
  | { success: false; errors: PublishFieldErrors };

function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function hasBodyTextOrImage(html: string): boolean {
  return extractContentImageIds(html).length > 0 || html.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim().length > 0;
}

export function toSaveDraftPayload(form: PostWriteForm): SaveDraftPayload {
  return {
    title: nullable(form.title),
    summary: nullable(form.summary),
    content: nullable(form.content),
    categoryName: nullable(form.category),
    tagNames: form.tags,
    thumbnailImageId: form.thumbnailImageId,
    contentImageIds: extractContentImageIds(form.content),
  };
}

export function toPublishPostPayload(form: PostWriteForm): PublishPayloadResult {
  const title = form.title.trim();
  const summary = form.summary.trim();
  const categoryName = form.category.trim();
  const errors: PublishFieldErrors = {};

  if (!title) errors.title = "제목을 입력해주세요.";
  if (!summary) errors.summary = "요약을 입력해주세요.";
  if (!hasBodyTextOrImage(form.content)) errors.content = "본문을 입력해주세요.";
  if (!categoryName) errors.category = "카테고리를 선택해주세요.";
  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    payload: {
      title,
      summary,
      content: form.content,
      categoryName,
      tagNames: form.tags,
      thumbnailImageId: form.thumbnailImageId,
      contentImageIds: extractContentImageIds(form.content),
    },
  };
}
