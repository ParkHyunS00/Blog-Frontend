import { z } from "zod";
import { apiRequest } from "../../../core/lib/api-client.ts";
import {
  draftDetailSchema,
  draftPageSchema,
  postImageUploadSchema,
  postMutationResultSchema,
  tagListSchema,
} from "./post-write.schemas.ts";
import type {
  DraftDetail,
  DraftPage,
  PostImageType,
  PostImageUploadResult,
  PostMutationResult,
  PublishPostPayload,
  SaveDraftPayload,
  TagListItem,
} from "../types/post-write-api.types.ts";

export function fetchTagList(): Promise<TagListItem[]> {
  return apiRequest("/api/tags", { method: "GET" }, tagListSchema);
}

export function uploadPostImage(file: File, type: PostImageType): Promise<PostImageUploadResult> {
  const body = new FormData();
  body.append("file", file);
  return apiRequest(`/api/admin/post-images?type=${type}`, { method: "POST", body }, postImageUploadSchema);
}

export function deletePostImage(imageId: number): Promise<null> {
  return apiRequest(`/api/admin/post-images/${imageId}`, { method: "DELETE" }, z.null());
}

export function createPost(payload: PublishPostPayload): Promise<PostMutationResult> {
  return apiRequest("/api/admin/posts", { method: "POST", body: JSON.stringify(payload) }, postMutationResultSchema);
}

export function updatePublishedPost(postId: number, payload: PublishPostPayload): Promise<PostMutationResult> {
  return apiRequest(`/api/admin/posts/${postId}`, { method: "PUT", body: JSON.stringify(payload) }, postMutationResultSchema);
}

export function deletePublishedPost(postId: number): Promise<null> {
  return apiRequest(`/api/admin/posts/${postId}`, { method: "DELETE" }, z.null());
}

export function createDraft(payload: SaveDraftPayload): Promise<PostMutationResult> {
  return apiRequest("/api/admin/posts/draft", { method: "POST", body: JSON.stringify(payload) }, postMutationResultSchema);
}

export function updateDraft(postId: number, payload: SaveDraftPayload): Promise<PostMutationResult> {
  return apiRequest(`/api/admin/posts/draft/${postId}`, { method: "PUT", body: JSON.stringify(payload) }, postMutationResultSchema);
}

export function fetchDraftList(page: number): Promise<DraftPage> {
  return apiRequest(`/api/admin/posts/draft?page=${page}`, { method: "GET" }, draftPageSchema);
}

export function fetchDraftDetail(postId: number): Promise<DraftDetail> {
  return apiRequest(`/api/admin/posts/draft/${postId}`, { method: "GET" }, draftDetailSchema);
}

export function publishDraft(postId: number, payload: PublishPostPayload): Promise<PostMutationResult> {
  return apiRequest(`/api/admin/posts/draft/${postId}/publish`, { method: "POST", body: JSON.stringify(payload) }, postMutationResultSchema);
}

export function deleteDraft(postId: number): Promise<null> {
  return apiRequest(`/api/admin/posts/draft/${postId}`, { method: "DELETE" }, z.null());
}
