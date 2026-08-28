type PostDetailSummaryProps = {
  summary: string;
};

export function PostDetailSummary({ summary }: PostDetailSummaryProps): React.ReactElement | null {
  if (!summary.trim()) return null;

  return (
    <aside
      aria-label="게시글 요약"
      className="mb-28 rounded-xl border-l-4 border-l-[#305CEC] bg-secondary/60 px-5 py-4 dark:border-l-[#5B7FFF] dark:bg-secondary/40 sm:px-6 sm:py-5"
    >
      <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{summary}</p>
    </aside>
  );
}
