import { useVisitorStats } from "@/features/visitor/hooks/use-visitor-stats";

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function VisitorStats(): React.ReactElement {
  const query = useVisitorStats();
  function count(value: number | undefined) {
    if (value !== undefined) return numberFormatter.format(value);
    if (query.isPending)
      return <span aria-label="불러오는 중" className="inline-block h-4 w-12 animate-pulse rounded bg-muted" />;
    return "—";
  }
  return (
    <section aria-label="방문자 통계" className="mt-12">
      <h2 className="text-center text-sm font-bold tracking-widest text-foreground">VISITORS</h2>
      <hr className="my-3 border-border" />
      <dl className="space-y-3 px-2 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 text-muted-foreground">전체</dt>
          <dd className="min-w-0 break-all text-right font-bold text-foreground tabular-nums">
            {count(query.data?.total)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 text-muted-foreground">오늘</dt>
          <dd className="min-w-0 break-all text-right text-foreground tabular-nums">{count(query.data?.today)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 text-muted-foreground">어제</dt>
          <dd className="min-w-0 break-all text-right text-foreground tabular-nums">{count(query.data?.yesterday)}</dd>
        </div>
      </dl>
      {query.isError && (
        <div className="mt-3 px-2 text-xs text-muted-foreground" role="status">
          <p>{query.data ? "통계를 갱신하지 못했습니다." : "통계를 불러오지 못했습니다."}</p>
          <button
            type="button"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
            className="mt-1 underline underline-offset-4 disabled:opacity-50"
          >
            {query.isFetching ? "불러오는 중" : "다시 시도"}
          </button>
        </div>
      )}
    </section>
  );
}
