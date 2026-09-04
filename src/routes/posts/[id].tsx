import { useLayoutEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostDetailLayout } from "@/components/post-detail/post-detail-layout";
import { PostDetailHeader } from "@/components/post-detail/post-detail-header";
import { PostDetailContent } from "@/components/post-detail/post-detail-content";
import { PostDetailToc } from "@/components/post-detail/post-detail-toc";
import { PostDetailTocMobile } from "@/components/post-detail/post-detail-toc-mobile";
import { PostDetailComments } from "@/components/post-detail/post-detail-comments";
import { PostDetailTags } from "@/components/post-detail/post-detail-tags";
import { PostDetailSummary } from "@/components/post-detail/post-detail-summary";
import { PostDetailSkeleton } from "@/components/post-detail/post-detail-skeleton";
import { PostAdminActions } from "@/components/post-detail/post-admin-actions";
import { ErrorPage } from "@/components/shared/error-page";
import { ApiException } from "@/core/lib/api-client";
import { useDocumentDescription } from "@/core/seo/use-document-description";
import { useToast } from "@/core/toast/toast-context";
import { useAuthStatus } from "@/features/admin-auth/hooks/queries/use-auth-status";
import { canManagePosts } from "@/features/admin-auth/lib/can-manage-posts";
import { mapPostDetail } from "@/features/post/api/post-detail";
import { usePostDetail } from "@/features/post/hooks/queries/use-post-detail";
import { prepareTocContent } from "@/features/post/lib/prepare-toc-content";
import { scrollPageToTop } from "@/features/post/lib/scroll-page-top";
import { useActiveToc } from "@/features/post/hooks/use-active-toc";
import { useDeletePublishedPostMutation } from "@/features/post-write/hooks/mutations/use-delete-published-post";

export function PostDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const postId = Number(id);
  const isValidPostId = Number.isInteger(postId) && postId > 0;
  const postDetailQuery = usePostDetail(postId);
  const authStatusQuery = useAuthStatus();
  const deleteMutation = useDeletePublishedPostMutation(postId);
  const post = useMemo(
    () => (postDetailQuery.data ? mapPostDetail(postDetailQuery.data) : null),
    [postDetailQuery.data],
  );
  useDocumentDescription(post?.summary);
  const preparedContent = useMemo(
    () => prepareTocContent(post?.content ?? ""),
    [post?.content],
  );
  const { activeId, handleTocClick } = useActiveToc(preparedContent.items);

  useLayoutEffect(() => {
    scrollPageToTop(window);
  }, [postId]);

  async function handleDelete(): Promise<void> {
    try {
      await deleteMutation.mutateAsync();
      showSuccessToast({
        title: "게시글 삭제 완료",
        description: "게시글이 정상적으로 삭제되었습니다.",
      });
      navigate("/");
    } catch (error) {
      const fallback = "게시글 삭제에 실패했습니다.";
      showErrorToast({ title: "게시글 삭제 실패", error, fallback });
      throw error;
    }
  }

  if (!isValidPostId) return <ErrorPage kind="NOT_FOUND" />;

  if (postDetailQuery.isPending) {
    return <PostDetailSkeleton />;
  }

  if (postDetailQuery.isError) {
    if (
      postDetailQuery.error instanceof ApiException &&
      postDetailQuery.error.status === 404
    ) {
      return <ErrorPage kind="NOT_FOUND" />;
    }

    return (
      <div className="flex flex-1 items-center justify-center px-4 py-24 text-muted-foreground">
        게시글을 불러오지 못했습니다.
      </div>
    );
  }

  if (!post) return <ErrorPage kind="NOT_FOUND" />;

  return (
    <PostDetailLayout
      header={
        <PostDetailHeader
          title={post.title}
          category={post.category}
          createdAt={post.createdAt}
          viewCount={post.viewCount}
          actions={
            canManagePosts(authStatusQuery.data) ? (
              <PostAdminActions
                postId={post.id}
                postTitle={post.title}
                isDeleting={deleteMutation.isPending}
                onDelete={handleDelete}
              />
            ) : null
          }
        />
      }
      toc={
        <PostDetailToc
          items={preparedContent.items}
          activeId={activeId}
          onItemClick={handleTocClick}
        />
      }
      tocMobile={
        <PostDetailTocMobile
          items={preparedContent.items}
          activeId={activeId}
          onItemClick={handleTocClick}
        />
      }
    >
      <PostDetailSummary summary={post.summary} />
      <PostDetailContent content={preparedContent.html} />
      <PostDetailTags tags={post.tags} />
      <PostDetailComments />
    </PostDetailLayout>
  );
}
