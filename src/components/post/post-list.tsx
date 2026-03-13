import { PostCard } from "@/components/post/post-card";
import type { Post } from "@/features/post/types/post.types";

type PostListProps = {
  posts: Post[];
};

const CARD_STYLE: React.CSSProperties = {
  contentVisibility: "auto",
  containIntrinsicSize: "auto 200px",
};

export function PostList({ posts }: PostListProps): React.ReactElement {
  return (
    <div className="flex flex-col">
      {posts.map((post) => (
        <div key={post.id} style={CARD_STYLE}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
