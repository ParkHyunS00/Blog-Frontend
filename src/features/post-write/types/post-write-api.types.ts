import type { z } from "zod";
import type {
  draftDetailSchema,
  draftPageSchema,
  postImageUploadSchema,
  postMutationResultSchema,
  tagListSchema,
} from "../api/post-write.schemas";

export type PostImageType = "CONTENT" | "THUMBNAIL";
export type PostImageUploadResult = z.infer<typeof postImageUploadSchema>;
export type PostMutationResult = z.infer<typeof postMutationResultSchema>;
export type DraftPage = z.infer<typeof draftPageSchema>;
export type DraftDetail = z.infer<typeof draftDetailSchema>;
export type TagListItem = z.infer<typeof tagListSchema>[number];

export type SaveDraftPayload = {
  title: string | null;
  summary: string | null;
  content: string | null;
  categoryName: string | null;
  tagNames: string[];
  thumbnailImageId: number | null;
  contentImageIds: number[];
};

export type PublishPostPayload = {
  title: string;
  summary: string;
  content: string;
  categoryName: string;
  tagNames: string[];
  thumbnailImageId: number | null;
  contentImageIds: number[];
};
