import { Badge } from "@/components/ui/badge";

type PostDetailTagsProps = {
  tags: string[];
};

export function PostDetailTags({ tags }: PostDetailTagsProps): React.ReactElement | null {
  if (tags.length === 0) return null;

  return (
    <section className="mt-14 flex flex-wrap gap-3" aria-label="게시글 태그">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="max-w-full min-w-0 px-4 py-2 text-sm text-[#305CEC] dark:text-[#5B7FFF]"
        >
          <span className="min-w-0 truncate">{tag}</span>
        </Badge>
      ))}
    </section>
  );
}
