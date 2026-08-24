import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/core/toast/toast-context";
import { API_BASE_URL } from "@/core/lib/api-client";
import { CategorySelect } from "@/components/post-write/category-select";
import { DraftListDialog } from "@/components/post-write/draft-list-dialog";
import { PostWriteSkeleton } from "@/components/post-write/post-write-skeleton";
import { SummaryInput } from "@/components/post-write/summary-input";
import { TagInput } from "@/components/post-write/tag-input";
import { ThumbnailInput } from "@/components/post-write/thumbnail-input";
import { TitleInput } from "@/components/post-write/title-input";
import { useAuthStatus } from "@/features/admin-auth/hooks/queries/use-auth-status";
import { useCategoryList } from "@/features/category/hooks/queries/use-category-list";
import { deletePostImage } from "@/features/post-write/api/post-write-api";
import { usePublishPostMutation } from "@/features/post-write/hooks/mutations/use-publish-post";
import { useSaveDraftMutation } from "@/features/post-write/hooks/mutations/use-save-draft";
import { useUploadPostImage } from "@/features/post-write/hooks/mutations/use-upload-post-image";
import { useUpdatePublishedPostMutation } from "@/features/post-write/hooks/mutations/use-update-published-post";
import { useDraftDetail } from "@/features/post-write/hooks/queries/use-draft-detail";
import { useTagList } from "@/features/post-write/hooks/queries/use-tag-list";
import type { DraftDetail } from "@/features/post-write/types/post-write-api.types";
import { resolveEditorMode, type EditorMode, type EditorModeType } from "@/features/post-write/lib/editor-mode";
import { createFormFromPublishedPost } from "@/features/post-write/lib/published-post-form";
import { diffImageIds, extractContentImageIds } from "@/features/post-write/lib/post-image-ids";
import { toPublishPostPayload, toSaveDraftPayload } from "@/features/post-write/lib/post-write-payload";
import { usePostDetail } from "@/features/post/hooks/queries/use-post-detail";
import { POST_TAG_MAX_LENGTH } from "@/features/post/lib/post-write-constraints";
import { hasPostWriteContent } from "@/features/post/lib/post-write-form";
import { getPostImageDisplayUrl } from "@/features/post/lib/post-image-url";
import type { PostWriteForm } from "@/features/post/types/post-write.types";

const PostEditor = lazy(() => import("@/components/post-write/post-editor").then((module) => ({ default: module.PostEditor })));

function createEmptyForm(): PostWriteForm {
  return {
    title: "", summary: "", thumbnailFile: null, thumbnailUrl: "", thumbnailImageId: null,
    category: "", tags: [], content: "", contentImageIds: [],
  };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

type PostWritePageProps = {
  modeType: EditorModeType;
};

export function PostWritePage({ modeType }: PostWritePageProps): React.ReactElement | null {
  const { postId: postIdParam } = useParams();
  const mode = resolveEditorMode(modeType, postIdParam);
  const draftId = mode?.type === "EDIT_DRAFT" ? mode.draftId : null;
  const publishedPostId = mode?.type === "EDIT_PUBLISHED" ? mode.postId : null;
  const { data: authStatus, isLoading: isAuthLoading } = useAuthStatus();
  const draftDetailQuery = useDraftDetail(draftId);
  const publishedDetailQuery = usePostDetail(publishedPostId ?? 0);

  if (isAuthLoading) return null;
  if (authStatus?.step !== "AUTHENTICATED") return <Navigate to="/admin" replace />;
  if (!mode) return <Navigate to="/admin/posts/write" replace />;

  const activeDetailQuery = mode.type === "EDIT_DRAFT" ? draftDetailQuery : publishedDetailQuery;
  if (mode.type !== "CREATE" && activeDetailQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-destructive">
          {mode.type === "EDIT_DRAFT" ? "임시저장 글을 불러오지 못했습니다." : "수정할 게시글을 불러오지 못했습니다."}
        </p>
        <Button variant="outline" size="sm" onClick={() => activeDetailQuery.refetch()}>다시 시도</Button>
      </div>
    );
  }
  if (mode.type !== "CREATE" && !activeDetailQuery.data) return <PostWriteSkeleton />;

  const initialForm = mode.type === "CREATE"
    ? createEmptyForm()
    : mode.type === "EDIT_DRAFT"
      ? createFormFromDraft(draftDetailQuery.data!)
      : createFormFromPublishedPost(publishedDetailQuery.data!, API_BASE_URL);

  return (
    <PostWriteEditorPage
      key={mode.type === "CREATE" ? "new" : `${mode.type}-${mode.type === "EDIT_DRAFT" ? mode.draftId : mode.postId}`}
      mode={mode}
      initialForm={initialForm}
    />
  );
}

function createFormFromDraft(draft: DraftDetail): PostWriteForm {
  return {
    title: draft.title,
    summary: draft.summary,
    thumbnailFile: null,
    thumbnailUrl: draft.thumbnailImageId ? getPostImageDisplayUrl(draft.thumbnailImageId, API_BASE_URL) : "",
    thumbnailImageId: draft.thumbnailImageId,
    category: draft.category?.name ?? "",
    tags: draft.tags.map((tag) => tag.name),
    content: draft.content,
    contentImageIds: draft.contentImageIds,
  };
}

function PostWriteEditorPage({ mode, initialForm }: { mode: EditorMode; initialForm: PostWriteForm }): React.ReactElement {
  const draftId = mode.type === "EDIT_DRAFT" ? mode.draftId : null;
  const publishedPostId = mode.type === "EDIT_PUBLISHED" ? mode.postId : null;
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const categoryQuery = useCategoryList();
  const tagQuery = useTagList();
  const uploadMutation = useUploadPostImage();
  const saveMutation = useSaveDraftMutation(draftId);
  const publishMutation = usePublishPostMutation(draftId);
  const updateMutation = useUpdatePublishedPostMutation(publishedPostId);
  const [form, setForm] = useState<PostWriteForm>(initialForm);
  const [thumbnailError, setThumbnailError] = useState("");
  const persistedImageIdsRef = useRef(new Set([
    ...initialForm.contentImageIds,
    ...(initialForm.thumbnailImageId ? [initialForm.thumbnailImageId] : []),
  ]));
  const orphanImageIdsRef = useRef(new Set<number>());
  const pendingDeleteIdsRef = useRef(new Set<number>());

  useEffect(() => {
    const orphanIds = orphanImageIdsRef.current;
    return () => {
      for (const imageId of orphanIds) void deletePostImage(imageId).catch(() => undefined);
    };
  }, []);

  const categories = categoryQuery.data?.map((category) => category.name) ?? [];
  const tagSuggestions = tagQuery.data?.map((tag) => tag.name) ?? [];
  const isBusy = uploadMutation.isPending || saveMutation.isPending || publishMutation.isPending || updateMutation.isPending;

  async function deleteImageWithFeedback(imageId: number): Promise<void> {
    try {
      await deletePostImage(imageId);
    } catch (error) {
      showErrorToast({ title: "이미지 삭제 실패", error, fallback: "사용하지 않는 이미지를 삭제하지 못했습니다." });
    }
  }

  function scheduleImageRemoval(imageId: number): void {
    if (persistedImageIdsRef.current.has(imageId)) {
      pendingDeleteIdsRef.current.add(imageId);
      return;
    }
    orphanImageIdsRef.current.delete(imageId);
    void deleteImageWithFeedback(imageId);
  }

  async function finalizeSavedImages(nextForm: PostWriteForm): Promise<void> {
    const idsToDelete = [...pendingDeleteIdsRef.current];
    pendingDeleteIdsRef.current.clear();
    await Promise.all(idsToDelete.map(deleteImageWithFeedback));
    const connectedIds = [...extractContentImageIds(nextForm.content), ...(nextForm.thumbnailImageId ? [nextForm.thumbnailImageId] : [])];
    persistedImageIdsRef.current = new Set(connectedIds);
    for (const imageId of connectedIds) orphanImageIdsRef.current.delete(imageId);
  }

  async function handleThumbnailChange(value: { file: File | null; previewUrl: string }): Promise<void> {
    setThumbnailError("");
    if (!value.file) {
      if (form.thumbnailImageId) scheduleImageRemoval(form.thumbnailImageId);
      setForm((previous) => ({ ...previous, thumbnailFile: null, thumbnailUrl: "", thumbnailImageId: null }));
      return;
    }
    try {
      const uploaded = await uploadMutation.mutateAsync({ file: value.file, type: "THUMBNAIL" });
      if (form.thumbnailImageId) scheduleImageRemoval(form.thumbnailImageId);
      orphanImageIdsRef.current.add(uploaded.imageId);
      setForm((previous) => ({ ...previous, thumbnailFile: null, thumbnailUrl: getPostImageDisplayUrl(uploaded.imageId, API_BASE_URL), thumbnailImageId: uploaded.imageId }));
    } catch (error) {
      const fallback = "썸네일 업로드에 실패했습니다.";
      setThumbnailError(errorMessage(error, fallback));
      showErrorToast({ title: "썸네일 업로드 실패", error, fallback });
    }
  }

  async function handleContentImageUpload(file: File): Promise<string> {
    try {
      const uploaded = await uploadMutation.mutateAsync({ file, type: "CONTENT" });
      orphanImageIdsRef.current.add(uploaded.imageId);
      return getPostImageDisplayUrl(uploaded.imageId, API_BASE_URL);
    } catch (error) {
      showErrorToast({ title: "본문 이미지 업로드 실패", error, fallback: "본문 이미지 업로드에 실패했습니다." });
      throw error;
    }
  }

  function handleContentChange(content: string): void {
    const nextIds = extractContentImageIds(content);
    for (const imageId of nextIds) pendingDeleteIdsRef.current.delete(imageId);
    for (const removedId of diffImageIds(form.contentImageIds, nextIds)) scheduleImageRemoval(removedId);
    setForm((previous) => ({ ...previous, content, contentImageIds: nextIds }));
  }

  async function handleSaveDraft(): Promise<void> {
    try {
      const result = await saveMutation.mutateAsync(toSaveDraftPayload(form));
      await finalizeSavedImages(form);
      showSuccessToast({ title: "임시저장 완료", description: "작성 중인 글을 임시저장했습니다." });
      if (draftId === null) navigate(`/admin/posts/draft/${result.postId}/edit`, { replace: true });
    } catch (error) {
      const fallback = "임시저장에 실패했습니다.";
      showErrorToast({ title: "임시저장 실패", error, fallback });
    }
  }

  async function handleSubmit(): Promise<void> {
    const result = toPublishPostPayload(form);
    if (!result.success) {
      const message = Object.values(result.errors)[0] ?? "필수 입력값을 확인해주세요.";
      showErrorToast({
        title: mode.type === "EDIT_PUBLISHED" ? "게시글을 수정할 수 없습니다" : "게시글을 업로드할 수 없습니다",
        error: new Error(message),
        fallback: message,
      });
      return;
    }
    try {
      const published = mode.type === "EDIT_PUBLISHED"
        ? await updateMutation.mutateAsync(result.payload)
        : await publishMutation.mutateAsync(result.payload);
      await finalizeSavedImages(form);
      showSuccessToast(
        mode.type === "EDIT_PUBLISHED"
          ? { title: "게시글 수정 완료", description: "게시글이 정상적으로 수정되었습니다." }
          : { title: "게시글 업로드 완료", description: "게시글이 정상적으로 공개되었습니다." },
      );
      navigate(`/posts/${published.postId}`);
    } catch (error) {
      const isPublishedEdit = mode.type === "EDIT_PUBLISHED";
      const fallback = isPublishedEdit ? "게시글 수정에 실패했습니다." : "게시글 발행에 실패했습니다.";
      showErrorToast({ title: isPublishedEdit ? "게시글 수정 실패" : "게시글 업로드 실패", error, fallback });
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      <div className="space-y-10 md:space-y-12">
        <TitleInput value={form.title} onChange={(title) => setForm((previous) => ({ ...previous, title }))} />
        <div className="space-y-10 md:space-y-12">
          <SummaryInput value={form.summary} onChange={(summary) => setForm((previous) => ({ ...previous, summary }))} />
          <div className="mx-auto w-full max-w-[460px]"><ThumbnailInput value={{ file: form.thumbnailFile, previewUrl: form.thumbnailUrl }} onChange={handleThumbnailChange} isUploading={uploadMutation.isPending} uploadError={thumbnailError} /></div>
        </div>
        <div className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-2"><label className="text-sm font-medium text-muted-foreground">카테고리</label><CategorySelect value={form.category} onChange={(category) => setForm((previous) => ({ ...previous, category }))} categories={categories} /></div>
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex items-center justify-between gap-3"><label className="text-sm font-medium text-muted-foreground">태그</label><span className="truncate text-xs text-muted-foreground">태그는 최대 {POST_TAG_MAX_LENGTH}자까지 입력할 수 있습니다.</span></div>
              <TagInput value={form.tags} onChange={(tags) => setForm((previous) => ({ ...previous, tags }))} suggestions={tagSuggestions} />
            </div>
          </div>
          {categoryQuery.isError || tagQuery.isError ? <p className="text-sm text-destructive">카테고리 또는 태그 목록을 불러오지 못했습니다.</p> : null}
        </div>
        <Suspense fallback={<div className="flex h-[600px] items-center justify-center rounded-lg border bg-background text-muted-foreground">에디터 로딩 중...</div>}>
          <PostEditor content={form.content} onChange={handleContentChange} onUploadImage={handleContentImageUpload} className="h-[600px]" />
        </Suspense>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {mode.type !== "EDIT_PUBLISHED" ? (
            <>
              <DraftListDialog hasUnsavedContent={hasPostWriteContent(form)} onSelect={(postId) => navigate(`/admin/posts/draft/${postId}/edit`)} />
              <Button variant="outline" disabled={isBusy} onClick={handleSaveDraft}>{saveMutation.isPending ? "저장 중..." : "임시 저장"}</Button>
            </>
          ) : null}
          <Button disabled={isBusy} onClick={handleSubmit}>
            {updateMutation.isPending
              ? "수정 중..."
              : publishMutation.isPending
                ? "발행 중..."
                : mode.type === "EDIT_PUBLISHED"
                  ? "수정"
                  : mode.type === "EDIT_DRAFT"
                    ? "발행"
                    : "업로드"}
          </Button>
        </div>
      </div>
    </div>
  );
}
