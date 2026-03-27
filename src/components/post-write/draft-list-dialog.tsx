import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Draft } from "@/features/post/types/draft.types";

type DraftListDialogProps = {
  drafts: Draft[];
  onSelect: (draft: Draft) => void;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DraftItem({
  draft,
  onSelect,
}: {
  draft: Draft;
  onSelect: (draft: Draft) => void;
}): React.ReactElement {
  function handleClick(): void {
    onSelect(draft);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-lg border border-border p-4 text-left transition-colors hover:bg-secondary"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">
          {draft.title.trim() ? draft.title : "제목 없음"}
        </h3>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatDate(draft.savedAt)}
        </span>
      </div>
      {(draft.category || draft.tags.length > 0) ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {draft.category ? (
            <span className="text-xs text-muted-foreground">
              {draft.category}
            </span>
          ) : null}
          {draft.category && draft.tags.length > 0 ? (
            <span className="text-xs text-muted-foreground">·</span>
          ) : null}
          {draft.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="px-2 py-0.5 text-xs text-[#305CEC] dark:text-[#5B7FFF]"
            >
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}
    </button>
  );
}

export function DraftListDialog({
  drafts,
  onSelect,
}: DraftListDialogProps): React.ReactElement {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">불러오기</Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-md">
        <DialogHeader>
          <DialogTitle>임시 저장 목록</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {drafts.length > 0 ? (
            drafts.map((draft) => (
              <DraftItem key={draft.id} draft={draft} onSelect={onSelect} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              임시 저장된 글이 없습니다.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
