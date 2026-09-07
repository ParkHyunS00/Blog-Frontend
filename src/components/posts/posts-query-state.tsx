export type PostsQueryStateProps = {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function PostsQueryState({
  isLoading,
  isError,
  onRetry,
  kind,
}: PostsQueryStateProps & { kind: "category" | "popular" }) {
  const label = kind === "category" ? "카테고리별 최신 글" : "인기 글";
  if (isLoading)
    return (
      <div
        role="status"
        aria-label={label + " 불러오는 중"}
        className={
          kind === "category"
            ? "mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            : "mt-6 divide-y divide-border border-y border-border"
        }
      >
        {Array.from({ length: kind === "category" ? 6 : 3 }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={
              kind === "category"
                ? "min-h-64 animate-pulse rounded-2xl border border-border p-6"
                : "flex animate-pulse items-center justify-between gap-4 px-4 py-6"
            }
          >
            <div className="w-full">
              {kind === "category" && <div className="mb-7 h-5 w-24 rounded bg-muted" />}
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="mt-3 h-4 w-1/2 rounded bg-muted" />
              {kind === "category" && (
                <div className="mt-7 border-t border-border pt-4">
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              )}
            </div>
            {kind === "popular" && <div className="h-5 w-16 shrink-0 rounded bg-muted" />}
          </div>
        ))}
      </div>
    );
  return (
    <div
      className="mt-6 rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground"
      role={isError ? "alert" : "status"}
    >
      {isError ? label + "을 불러오지 못했습니다." : "아직 공개된 게시글이 없습니다."}
      {isError && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-3 font-semibold text-foreground underline underline-offset-4"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
