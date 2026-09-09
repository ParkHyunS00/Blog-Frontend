import { CategoryLatestGrid } from "@/components/posts/category-latest-grid";
import { PopularPosts } from "@/components/posts/popular-posts";
import { PostsTagCloud } from "@/components/posts/posts-tag-cloud";
import { useDocumentDescription } from "@/core/seo/use-document-description";
import { useTagList } from "@/features/post-write/hooks/queries/use-tag-list";
import { useCategoryLatestPosts, usePopularPosts } from "@/features/posts/hooks/use-posts-explore";

export function PostsPage(): React.ReactElement {
  useDocumentDescription("태그와 카테고리별로 개발 기록을 탐색하고 인기 게시글을 확인해보세요.");
  const tagListQuery = useTagList();
  const categoriesQuery = useCategoryLatestPosts();
  const popularQuery = usePopularPosts();

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 pt-12 pb-10 sm:pt-16 sm:pb-14">
      <div className="space-y-16 sm:space-y-20">
        <PostsTagCloud
          tags={tagListQuery.data ?? []}
          isLoading={tagListQuery.isPending}
          isError={tagListQuery.isError}
          onRetry={() => void tagListQuery.refetch()}
        />
        <CategoryLatestGrid
          posts={categoriesQuery.data ?? []}
          isLoading={categoriesQuery.isPending}
          isError={categoriesQuery.isError}
          onRetry={() => void categoriesQuery.refetch()}
        />
        <PopularPosts
          posts={popularQuery.data ?? []}
          isLoading={popularQuery.isPending}
          isError={popularQuery.isError}
          onRetry={() => void popularQuery.refetch()}
        />
      </div>
    </div>
  );
}
