import { RiRefreshLine } from "@remixicon/react";
import { Link } from "react-router-dom";
import { PostTag } from "@/components/post/post-tag";
import type { TagListItem } from "@/features/post-write/types/post-write-api.types";

type PostsTagCloudProps = {
  tags: TagListItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function PostsTagCloud({ tags, isLoading, isError, onRetry }: PostsTagCloudProps): React.ReactElement {
  return (
    <section aria-labelledby="posts-tags-title" className="min-h-11">
      <h2
        id="posts-tags-title"
        className="text-base font-bold tracking-[0.14em] text-[#305CEC] dark:text-[#8BA6FF] sm:text-lg"
      >
        TAGS
      </h2>
      <div className="mt-5">
        {isLoading ? (
          <div className="flex flex-wrap gap-2" role="status" aria-label="태그 목록을 불러오는 중">
            {[84, 112, 72, 96, 80, 104].map((width) => (
              <span key={width} className="h-9 animate-pulse rounded-full bg-secondary" style={{ width }} />
            ))}
          </div>
        ) : null}
        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <span>태그 목록을 불러오지 못했습니다.</span>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 font-semibold text-foreground underline underline-offset-4"
            >
              <RiRefreshLine aria-hidden="true" className="size-4" />
              다시 시도
            </button>
          </div>
        ) : null}
        {!isLoading && !isError && tags.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
            아직 등록된 태그가 없습니다.
          </p>
        ) : null}
        {!isLoading && !isError && tags.length > 0 ? (
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {tags.map((tag) => (
              <Link
                key={tag.tagId}
                to={`/?tags=${encodeURIComponent(tag.slug)}`}
                className="shrink-0 rounded-full transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#305CEC] focus-visible:ring-offset-2"
                aria-label={`${tag.name} 태그의 게시글 보기`}
              >
                <PostTag tag={tag.name} size="lg" />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
