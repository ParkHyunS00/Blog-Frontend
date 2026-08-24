import { Link } from "react-router-dom";
import { PostTag } from "@/components/post/post-tag";
import type { Post } from "@/features/post/types/post.types";

type PostCardProps = {
  post: Post;
  isLast?: boolean;
  priority?: boolean;
};

export function PostCard({ post, isLast = false, priority = false }: PostCardProps): React.ReactElement {
  return (
    <Link
      to={`/posts/${post.id}`}
      className={`group relative flex flex-col gap-4 py-10 sm:flex-row sm:gap-6 ${isLast ? "" : "border-b border-border"}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-10 right-0 w-1 bg-transparent transition-colors group-hover:bg-[#305CEC] dark:group-hover:bg-[#5B7FFF]"
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden py-1 pr-2">
        <div>
          <h2 className="text-xl font-bold text-foreground">{post.title}</h2>
          <p className="mt-3 line-clamp-2 text-base text-muted-foreground">{post.summary}</p>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <div className="flex min-h-6 flex-wrap gap-3">
            {post.tags.length > 0
              ? post.tags.map((tag) => (
                  <PostTag key={tag} tag={tag} />
                ))
              : null}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.category}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
          </div>
        </div>
      </div>

      {post.thumbnailUrl ? (
        <div className="w-full flex-shrink-0 pr-4 sm:w-auto">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="h-[180px] w-full rounded-lg object-cover sm:h-[160px] sm:w-[230px]"
          />
        </div>
      ) : null}
    </Link>
  );
}
