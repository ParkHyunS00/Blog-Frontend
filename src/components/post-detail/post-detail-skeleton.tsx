import { PostDetailLayout } from "@/components/post-detail/post-detail-layout";

const BODY_LINE_WIDTHS = ["w-full", "w-11/12", "w-full", "w-4/5"] as const;
const TOC_ITEM_WIDTHS = ["w-32", "w-24", "w-36", "w-28", "w-32"] as const;

function PostDetailHeaderSkeleton(): React.ReactElement {
  return (
    <header className="relative mb-14 animate-pulse pb-14">
      <div className="mx-auto h-9 w-3/4 max-w-xl rounded-md bg-muted" />
      <div className="mt-6 flex items-center justify-center gap-5">
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-5 w-24 rounded bg-muted" />
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 w-dvw -translate-x-1/2 border-b border-border"
      />
    </header>
  );
}

function PostDetailTocSkeleton(): React.ReactElement {
  return (
    <nav className="hidden h-full min-[1344px]:block" aria-hidden="true">
      <div className="sticky top-40 w-48 animate-pulse border-l-2 border-border pl-4">
        <div className="space-y-4">
          {TOC_ITEM_WIDTHS.map((width, index) => (
            <div key={`${width}-${index}`} className={`h-4 rounded bg-muted ${width}`} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function PostDetailBodySkeleton(): React.ReactElement {
  return (
    <div className="animate-pulse">
      <div className="mb-28 rounded-xl border-l-4 border-l-muted bg-secondary/60 px-5 py-5 sm:px-6">
        <div className="h-6 w-full rounded bg-muted" />
        <div className="mt-3 h-6 w-4/5 rounded bg-muted" />
      </div>

      <div className="space-y-4">
        {BODY_LINE_WIDTHS.map((width, index) => (
          <div key={`${width}-${index}`} className={`h-5 rounded bg-muted ${width}`} />
        ))}
      </div>

      <div className="mt-14 h-8 w-2/5 rounded-md bg-muted" />
      <div className="mt-7 space-y-4">
        {BODY_LINE_WIDTHS.map((width, index) => (
          <div key={`second-${width}-${index}`} className={`h-5 rounded bg-muted ${width}`} />
        ))}
      </div>

      <div className="mt-14 h-52 w-full rounded-xl bg-muted" />

      <div className="mt-14 flex gap-3">
        <div className="h-9 w-20 rounded-full bg-muted" />
        <div className="h-9 w-24 rounded-full bg-muted" />
        <div className="h-9 w-16 rounded-full bg-muted" />
      </div>

      <div className="mt-12 border-t border-border pt-10">
        <div className="h-28 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export function PostDetailSkeleton(): React.ReactElement {
  return (
    <div aria-label="게시글 상세 불러오는 중" aria-busy="true">
      <PostDetailLayout
        header={<PostDetailHeaderSkeleton />}
        toc={<PostDetailTocSkeleton />}
        tocMobile={
          <div
            aria-hidden="true"
            className="fixed top-18 right-4 h-12 w-12 animate-pulse rounded-full bg-muted min-[1344px]:hidden"
          />
        }
      >
        <PostDetailBodySkeleton />
      </PostDetailLayout>
    </div>
  );
}
