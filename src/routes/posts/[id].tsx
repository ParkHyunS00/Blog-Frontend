import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PostDetailLayout } from "@/components/post-detail/post-detail-layout";
import { PostDetailHeader } from "@/components/post-detail/post-detail-header";
import { PostDetailContent } from "@/components/post-detail/post-detail-content";
import { PostDetailToc } from "@/components/post-detail/post-detail-toc";
import { PostDetailTocMobile } from "@/components/post-detail/post-detail-toc-mobile";
import { PostDetailComments } from "@/components/post-detail/post-detail-comments";
import { PostDetailTags } from "@/components/post-detail/post-detail-tags";
import { PostDetailSummary } from "@/components/post-detail/post-detail-summary";
import { PostDetailSkeleton } from "@/components/post-detail/post-detail-skeleton";
import { ErrorPage } from "@/components/shared/error-page";
import { ApiException } from "@/core/lib/api-client";
import { mapPostDetail } from "@/features/post/api/post-detail";
import { usePostDetail } from "@/features/post/hooks/queries/use-post-detail";
import { prepareTocContent } from "@/features/post/lib/prepare-toc-content";
import { useActiveToc } from "@/features/post/hooks/use-active-toc";

export function PostDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const isValidPostId = Number.isInteger(postId) && postId > 0;
  const postDetailQuery = usePostDetail(postId);
  const post = useMemo(
    () => (postDetailQuery.data ? mapPostDetail(postDetailQuery.data) : null),
    [postDetailQuery.data],
  );
  const preparedContent = useMemo(
    () => prepareTocContent(post?.content ?? ""),
    [post?.content],
  );
  const { activeId, handleTocClick } = useActiveToc(preparedContent.items);

  if (!isValidPostId) return <ErrorPage kind="NOT_FOUND" />;

  if (postDetailQuery.isPending) {
    return <PostDetailSkeleton />;
  }

  if (postDetailQuery.isError) {
    if (postDetailQuery.error instanceof ApiException && postDetailQuery.error.status === 404) {
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
