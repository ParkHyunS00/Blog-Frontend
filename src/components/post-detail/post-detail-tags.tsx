import { PostTag } from "@/components/post/post-tag";

type PostDetailTagsProps = {
  tags: string[];
};

export function PostDetailTags({ tags }: PostDetailTagsProps): React.ReactElement | null {
  if (tags.length === 0) return null;

  return (
    <section className="mt-40 flex flex-wrap gap-3 md:mt-56" aria-label="게시글 태그">
      {tags.map((tag) => (
        <PostTag key={tag} tag={tag} size="lg" />
      ))}
    </section>
  );
}
