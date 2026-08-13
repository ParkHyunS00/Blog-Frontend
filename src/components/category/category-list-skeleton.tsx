const SKELETON_ITEMS = Array.from({ length: 5 }, (_, index) => index);

export function CategoryListSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-2 px-2" aria-label="카테고리 불러오는 중" aria-busy="true">
      {SKELETON_ITEMS.map((item) => (
        <div key={item} className="flex animate-pulse items-center gap-3 py-1.5">
          <div className="h-[18px] w-[18px] rounded bg-muted" />
          <div className="h-4 flex-1 rounded bg-muted" />
          <div className="h-4 w-7 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
