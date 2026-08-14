import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PostList } from "@/components/post/post-list";
import { PostListSkeleton } from "@/components/post/post-list-skeleton";
import { PostPagination } from "@/components/post/post-pagination";
import { PageLayout } from "@/components/shared/page-layout";
import { API_BASE_URL } from "@/core/lib/api-client";
import { buildCategories } from "@/features/category/api/category-list";
import { useCategoryList } from "@/features/category/hooks/queries/use-category-list";
import { mapPostListItem } from "@/features/post/api/post-list";
import { usePostList } from "@/features/post/hooks/queries/use-post-list";
import { normalizePostPage } from "@/features/post/lib/normalize-post-page";
import {
  getSearchKeyword,
  getSelectedCategorySlug,
  searchParamsForPage,
} from "@/features/post/lib/post-list-search-params";

const POSTS_PER_PAGE = 5;

export function HomePage(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = getSelectedCategorySlug(searchParams);
  const searchKeyword = getSearchKeyword(searchParams);
  const rawPage = Number(searchParams.get("page"));
  const currentPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const postListQuery = usePostList({
    category: selectedCategorySlug ?? undefined,
    keyword: searchKeyword ?? undefined,
    page: currentPage - 1,
    size: POSTS_PER_PAGE,
  });
  const categoryListQuery = useCategoryList();

  const posts =
    postListQuery.data?.content.map((item) => mapPostListItem(item, API_BASE_URL)) ?? [];
  const categories = categoryListQuery.data ? buildCategories(categoryListQuery.data) : [];
  const normalizedPage = postListQuery.data
    ? normalizePostPage(currentPage, postListQuery.data.totalPages)
    : currentPage;

  useEffect(() => {
    if (!postListQuery.isSuccess || normalizedPage === currentPage) return;
    setSearchParams(searchParamsForPage(searchParams, normalizedPage), { replace: true });
  }, [currentPage, normalizedPage, postListQuery.isSuccess, searchParams, setSearchParams]);

  function handlePageChange(page: number): void {
    setSearchParams(searchParamsForPage(searchParams, page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <PageLayout
      categories={categories}
      isCategoriesLoading={categoryListQuery.isPending}
      isCategoriesError={categoryListQuery.isError}
      onCategoriesRetry={() => void categoryListQuery.refetch()}
    >
      {postListQuery.isPending ? <PostListSkeleton /> : null}
      {postListQuery.isError ? (
        <p className="py-20 text-center text-muted-foreground">
          게시글 목록을 불러오지 못했습니다.
        </p>
      ) : null}
      {postListQuery.isSuccess && normalizedPage === currentPage && posts.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          {searchKeyword ? "검색 결과가 없습니다." : "게시글이 없습니다."}
        </p>
      ) : null}
      {postListQuery.isSuccess && normalizedPage === currentPage && posts.length > 0 ? (
        <PostList posts={posts} />
      ) : null}
      {postListQuery.isSuccess && normalizedPage === currentPage ? (
        <PostPagination
          currentPage={postListQuery.data.page + 1}
          totalPages={postListQuery.data.totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}
    </PageLayout>
  );
}
