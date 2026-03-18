import { PostList } from "@/components/post/post-list";
import { PostPagination } from "@/components/post/post-pagination";
import { PageLayout } from "@/components/shared/page-layout";
import { mockPosts, POSTS_PER_PAGE } from "@/features/post/lib/mock-posts";
import { usePagination } from "@/core/hooks/use-pagination";
import { useCategoryStore } from "@/core/stores/use-category-store";

export function HomePage(): React.ReactElement {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);

  const filteredPosts =
    selectedCategory === "ALL"
      ? mockPosts
      : mockPosts.filter((post) => post.category === selectedCategory);

  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination({
      items: filteredPosts,
      perPage: POSTS_PER_PAGE,
    });

  return (
    <PageLayout>
      <PostList posts={currentItems} />
      <PostPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </PageLayout>
  );
}
