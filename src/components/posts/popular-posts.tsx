import { RiEyeLine } from "@remixicon/react";
import { Link } from "react-router-dom";
import { PostsQueryState, type PostsQueryStateProps } from "./posts-query-state";
import { formatCompactViewCount, type PopularPost } from "@/features/posts/lib/posts-page";

type PopularPostsProps = PostsQueryStateProps & {
  posts: PopularPost[];
};

export function PopularPosts({ posts, ...queryState }: PopularPostsProps): React.ReactElement {
  return (
    <section aria-labelledby="popular-posts-title">
      <h2
        id="popular-posts-title"
        className="text-base font-bold tracking-[0.14em] text-[#305CEC] dark:text-[#8BA6FF] sm:text-lg"
      >
        MOST READ
      </h2>

      {queryState.isLoading || queryState.isError || posts.length === 0 ? (
        <PostsQueryState {...queryState} kind="popular" />
      ) : (
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/posts/${post.id}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-5 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#305CEC] sm:px-4 sm:py-6"
              >
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-base leading-6 font-semibold transition-colors group-hover:text-[#305CEC] dark:group-hover:text-[#8BA6FF] sm:text-lg">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.publishedAt}</span>
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap text-muted-foreground">
                  <RiEyeLine aria-hidden="true" className="size-4" />
                  <span className="sr-only">조회수</span>
                  {formatCompactViewCount(post.viewCount)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
