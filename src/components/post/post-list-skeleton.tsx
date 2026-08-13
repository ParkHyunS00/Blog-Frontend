const SKELETON_ITEMS = Array.from({ length: 5 }, (_, index) => index);

export function PostListSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col" aria-label="게시글 목록 불러오는 중" aria-busy="true">
      {SKELETON_ITEMS.map((item) => (
        <div
          key={item}
          className={`flex animate-pulse flex-col gap-4 py-10 sm:flex-row sm:gap-6 ${
            item === SKELETON_ITEMS.length - 1 ? "" : "border-b border-border"
          }`}
        >
          <div className="h-[180px] w-full shrink-0 rounded-lg bg-muted sm:h-[160px] sm:w-[230px]" />
          <div className="flex min-w-0 flex-1 flex-col justify-between overflow-hidden border-r-4 border-r-transparent py-1 pr-2">
            <div>
              <div className="h-7 w-3/5 rounded-md bg-muted" />
              <div className="mt-2 h-6 w-full rounded-md bg-muted" />
              <div className="mt-1 h-6 w-4/5 rounded-md bg-muted" />
            </div>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="h-6 w-16 rounded-full bg-muted" />
                <div className="h-6 w-20 rounded-full bg-muted" />
              </div>
              <div className="flex h-5 items-center gap-2">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-4 w-1 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
