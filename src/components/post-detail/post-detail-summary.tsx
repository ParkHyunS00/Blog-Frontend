import { RiDoubleQuotesL } from "@remixicon/react";

type PostDetailSummaryProps = {
  summary: string;
};

export function PostDetailSummary({ summary }: PostDetailSummaryProps): React.ReactElement | null {
  if (!summary.trim()) return null;

  return (
    <blockquote
      aria-label="게시글 요약"
      className="mx-auto mb-28 flex w-fit max-w-full flex-col items-center gap-2 px-8 py-5 text-center sm:px-10"
    >
      <RiDoubleQuotesL aria-hidden="true" className="pointer-events-none size-7 shrink-0 text-muted-foreground/60" />
      <p className="break-words text-base leading-7 text-muted-foreground italic md:text-lg md:leading-8">{summary}</p>
    </blockquote>
  );
}
