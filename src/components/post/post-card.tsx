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
      className={`group flex flex-col gap-4 py-10 sm:flex-row sm:gap-6 ${isLast ? "" : "border-b border-border"}`}
    >
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-r-4 border-r-transparent py-1 pr-2 transition-colors group-hover:border-r-[#305CEC] dark:group-hover:border-r-[#5B7FFF]">
        <div>
          <h2 className="text-xl font-bold text-foreground">{post.title}</h2>
          <p className="mt-3 line-clamp-2 text-base text-muted-foreground">{post.summary}</p>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <PostTag key={tag} tag={tag} />
              ))}
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.category}</span>
            <span>·</span>
            <span>{post.createdAt}</span>
          </div>
        </div>
      </div>

      {post.thumbnailUrl ? (
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="h-[180px] w-full flex-shrink-0 rounded-lg object-cover sm:h-[160px] sm:w-[230px]"
        />
      ) : null}
    </Link>
  );
}
