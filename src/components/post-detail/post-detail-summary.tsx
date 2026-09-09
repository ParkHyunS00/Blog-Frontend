type PostDetailSummaryProps = {
  summary: string;
};

export function PostDetailSummary({ summary }: PostDetailSummaryProps): React.ReactElement | null {
  if (!summary.trim()) return null;

  return (
    <blockquote aria-label="게시글 요약" className="relative mx-auto mb-28 w-fit max-w-full px-8 py-5 sm:px-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 select-none font-serif text-5xl leading-none text-muted-foreground/60"
      >
        “
      </span>
      <p className="break-words text-base leading-7 text-muted-foreground italic md:text-lg md:leading-8">{summary}</p>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 -bottom-3 select-none font-serif text-5xl leading-none text-muted-foreground/60"
      >
        ”
      </span>
    </blockquote>
  );
}
