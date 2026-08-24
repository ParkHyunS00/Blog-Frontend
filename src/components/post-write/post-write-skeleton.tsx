export function PostWriteSkeleton(): React.ReactElement {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse space-y-6 px-4 py-8 md:py-12" aria-label="작성 중인 글 불러오는 중">
      <div className="h-12 rounded-md bg-secondary" />
      <div className="h-24 rounded-md bg-secondary" />
      <div className="h-52 max-w-[460px] rounded-md bg-secondary" />
      <div className="grid gap-4 md:grid-cols-2"><div className="h-10 rounded-md bg-secondary" /><div className="h-10 rounded-md bg-secondary" /></div>
      <div className="h-[600px] rounded-lg bg-secondary" />
    </div>
  );
}
