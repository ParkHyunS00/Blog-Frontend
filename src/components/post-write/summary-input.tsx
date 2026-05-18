import { POST_SUMMARY_MAX_LENGTH } from "@/features/post/lib/post-write-constraints";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SummaryInput({ value, onChange }: Props): React.ReactElement {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    onChange(e.target.value.slice(0, POST_SUMMARY_MAX_LENGTH));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="post-summary" className="text-sm font-medium text-muted-foreground">
          요약
        </label>
        <span
          className={cn(
            "text-xs text-muted-foreground",
            value.length >= POST_SUMMARY_MAX_LENGTH && "font-medium text-destructive",
          )}
        >
          {value.length}/{POST_SUMMARY_MAX_LENGTH}
        </span>
      </div>
      <textarea
        id="post-summary"
        value={value}
        onChange={handleChange}
        maxLength={POST_SUMMARY_MAX_LENGTH}
        rows={3}
        placeholder="게시글 목록에 표시될 요약을 입력하세요"
        className="min-h-24 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm leading-6 text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40"
      />
      <p className="text-xs text-muted-foreground">목록 카드에서 2줄로 표시되므로 핵심 내용을 120자 안에 정리하세요.</p>
    </div>
  );
}
