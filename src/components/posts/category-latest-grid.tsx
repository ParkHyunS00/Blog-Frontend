import { RiArrowRightLine, RiArticleLine, RiTimeLine } from "@remixicon/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PostsQueryState, type PostsQueryStateProps } from "./posts-query-state";
import type { CategoryLatestPost } from "@/features/posts/lib/posts-page";

type CategoryLatestGridProps = PostsQueryStateProps & {
  posts: CategoryLatestPost[];
};

export function CategoryLatestGrid({ posts, ...queryState }: CategoryLatestGridProps): React.ReactElement {
  const [visibleCount, setVisibleCount] = useState(6);
  const showPosts = !queryState.isLoading && !queryState.isError && posts.length > 0;
  return (
    <section aria-labelledby="category-latest-title">
      <div className="flex items-end justify-between gap-4">
        <h2
          id="category-latest-title"
          className="text-base font-bold tracking-[0.14em] text-[#305CEC] dark:text-[#8BA6FF] sm:text-lg"
        >
          LATEST BY CATEGORY
        </h2>
        <Link
          to="/"
          state={{ scrollToPostList: true }}
          className="hidden items-center gap-1 text-sm font-semibold text-[#305CEC] hover:underline dark:text-[#8BA6FF] sm:flex"
        >
          전체 글 보기 <RiArrowRightLine aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {!showPosts ? (
        <PostsQueryState {...queryState} kind="category" />
      ) : (
        <>
          <div id="category-latest-cards" className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.slice(0, visibleCount).map((post) => (
              <Link
                key={post.categorySlug}
                to={`/?category=${encodeURIComponent(post.categorySlug)}`}
                className="group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-[#305CEC]/35 hover:shadow-[0_18px_50px_rgba(30,48,90,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#305CEC] dark:hover:border-[#8BA6FF]/35 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)]"
              >
                <span className="font-mono text-sm font-semibold text-foreground">{post.category}</span>
                <div className="mt-7 flex-1">
                  <h3 className="text-lg leading-7 font-bold tracking-[-0.015em] group-hover:text-[#305CEC] dark:group-hover:text-[#8BA6FF]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.summary}</p>
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <RiArticleLine aria-hidden="true" className="size-3.5" /> {post.postCount} posts
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <RiTimeLine aria-hidden="true" className="size-3.5" /> {post.updatedAt}
                  </span>
                  <RiArrowRightLine
                    aria-hidden="true"
                    className="ml-auto size-4 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
          {visibleCount < posts.length && (
            <div className="mt-7 flex justify-center">
              <button
                type="button"
                aria-controls="category-latest-cards"
                onClick={() => setVisibleCount((count) => count + 6)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#305CEC]"
              >
                <span aria-hidden="true">···</span> 더 보기
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
