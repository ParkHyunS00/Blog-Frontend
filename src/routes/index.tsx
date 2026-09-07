import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { HomeHero } from "@/components/home/home-hero";
import { HomePostsReveal } from "@/components/home/home-posts-reveal";
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
import { getHomeUrlWithoutLegacyPostListHash } from "@/features/home/lib/home-location";
import { shouldShowHomeHero } from "@/features/home/lib/should-show-home-hero";
import {
  getSearchKeyword,
  getSelectedCategorySlug,
  getSelectedTagSlugs,
  searchParamsForPage,
} from "@/features/post/lib/post-list-search-params";

const POSTS_PER_PAGE = 5;

export function HomePage(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = getSelectedCategorySlug(searchParams);
  const searchKeyword = getSearchKeyword(searchParams);
  const selectedTagSlugs = getSelectedTagSlugs(searchParams);
  const rawPage = Number(searchParams.get("page"));
  const currentPage = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const showHero = shouldShowHomeHero(searchParams);

  const postListQuery = usePostList({
    category: selectedCategorySlug ?? undefined,
    tags: selectedTagSlugs.length > 0 ? selectedTagSlugs : undefined,
    keyword: searchKeyword ?? undefined,
    page: currentPage - 1,
    size: POSTS_PER_PAGE,
  });
  const categoryListQuery = useCategoryList();

  const posts = postListQuery.data?.content.map((item) => mapPostListItem(item, API_BASE_URL)) ?? [];
  const latestPost = posts[0] ? { id: posts[0].id, title: posts[0].title } : null;
  const categories = categoryListQuery.data ? buildCategories(categoryListQuery.data) : [];
  const normalizedPage = postListQuery.data
    ? normalizePostPage(currentPage, postListQuery.data.totalPages)
    : currentPage;

  useEffect(() => {
    if (location.state?.scrollToPostList !== true) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("post-list")?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
      const { scrollToPostList: _scrollToPostList, ...remainingState } = location.state;
      void _scrollToPostList;
      navigate(location.pathname + location.search + location.hash, {
        replace: true,
        state: remainingState,
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location, navigate]);

  useEffect(() => {
    const cleanUrl = getHomeUrlWithoutLegacyPostListHash(
      window.location.pathname,
      window.location.search,
      window.location.hash,
    );

    if (cleanUrl) window.history.replaceState(window.history.state, "", cleanUrl);
  }, []);

  useEffect(() => {
    if (!postListQuery.isSuccess || normalizedPage === currentPage) return;
    setSearchParams(searchParamsForPage(searchParams, normalizedPage), {
      replace: true,
    });
  }, [currentPage, normalizedPage, postListQuery.isSuccess, searchParams, setSearchParams]);

  function handlePageChange(page: number): void {
    setSearchParams(searchParamsForPage(searchParams, page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {showHero ? (
        <>
          <HomeHero
            latestPost={latestPost}
            isLatestPostLoading={postListQuery.isPending}
            isLatestPostError={postListQuery.isError}
          />
          <HomePostsReveal />
        </>
      ) : null}
      <PageLayout
        categories={categories}
        contentId="post-list"
        isCategoriesLoading={categoryListQuery.isPending}
        isCategoriesError={categoryListQuery.isError}
        onCategoriesRetry={() => void categoryListQuery.refetch()}
      >
        {postListQuery.isPending ? <PostListSkeleton /> : null}
        {postListQuery.isError ? (
          <p className="py-20 text-center text-muted-foreground">게시글 목록을 불러오지 못했습니다.</p>
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
    </>
  );
}
