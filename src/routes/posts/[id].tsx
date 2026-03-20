import { useParams } from "react-router-dom";
import { PostDetailLayout } from "@/components/post-detail/post-detail-layout";
import { PostDetailHeader } from "@/components/post-detail/post-detail-header";
import { PostDetailContent } from "@/components/post-detail/post-detail-content";
import { PostDetailToc } from "@/components/post-detail/post-detail-toc";
import { PostDetailTocMobile } from "@/components/post-detail/post-detail-toc-mobile";
import { PostDetailComments } from "@/components/post-detail/post-detail-comments";
import { findPostDetailById } from "@/features/post/lib/mock-post-detail";
import { parseToc } from "@/features/post/lib/parse-toc";
import { useActiveToc } from "@/features/post/hooks/use-active-toc";

export function PostDetailPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const post = findPostDetailById(Number(id));
  const tocItems = parseToc(post?.content ?? "");
  const { activeId, handleTocClick } = useActiveToc(tocItems);

  if (!post) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <PostDetailLayout
      toc={<PostDetailToc items={tocItems} activeId={activeId} onItemClick={handleTocClick} />}
      tocMobile={<PostDetailTocMobile items={tocItems} onItemClick={handleTocClick} />}
    >
      <PostDetailHeader title={post.title} category={post.category} createdAt={post.createdAt} />
      <PostDetailContent content={post.content} />
      <PostDetailComments />
    </PostDetailLayout>
  );
}
