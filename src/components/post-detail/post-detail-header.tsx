import { Eye } from "lucide-react";
import { formatPostViewCount } from "@/features/post/api/post-detail";

type PostDetailHeaderProps = {
  title: string;
  category: string;
  createdAt: string;
  viewCount: number;
  actions?: React.ReactNode;
};

export function PostDetailHeader({
  title,
  category,
  createdAt,
  viewCount,
  actions,
}: PostDetailHeaderProps): React.ReactElement {
  return (
    <header className="pb-14">
      <h1 className="text-center text-2xl font-bold leading-tight md:text-3xl">
        {title}
      </h1>
      <div
        aria-label="게시글 정보"
        className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
        role="group"
      >
        <span className="inline-flex items-center gap-1.5">
          <Eye aria-hidden="true" className="size-4" strokeWidth={1.8} />
          <span className="sr-only">조회수</span>
          <span>{formatPostViewCount(viewCount)}</span>
        </span>
        <span className="text-[#305CEC] dark:text-[#5B7FFF]">{category}</span>
        <span>{createdAt}</span>
      </div>
      {actions}
    </header>
  );
}
