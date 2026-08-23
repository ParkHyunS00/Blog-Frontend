import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PostTag } from "@/components/post/post-tag";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  clampDraftPage,
  DRAFTS_PER_PAGE,
  getDraftPage,
  getDraftLoadAction,
  getDraftTotalPages,
} from "@/features/post/lib/draft-list";
import type { Draft } from "@/features/post/types/draft.types";

type DraftListDialogProps = {
  drafts: Draft[];
  hasUnsavedContent: boolean;
  onSelect: (draft: Draft) => void;
  onDelete: (draftId: string) => void;
};

type DraftItemProps = {
  draft: Draft;
  onSelect: (draft: Draft) => void;
  onRequestDelete: (draft: Draft) => void;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DraftItem({ draft, onSelect, onRequestDelete }: DraftItemProps): React.ReactElement {
  const title = draft.title.trim() || "제목 없음";
  const visibleTags = draft.tags.slice(0, 2);
  const hiddenTagCount = draft.tags.length - visibleTags.length;

  return (
    <li className="group flex min-w-0 items-center border-b border-border last:border-b-0 hover:bg-muted/40">
      <button
        type="button"
        onClick={() => onSelect(draft)}
        className="min-w-0 flex-1 px-5 py-4 text-left outline-none focus-visible:bg-muted/60 sm:px-6"
        aria-label={`${title} 불러오기`}
      >
        <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <h3 className="truncate text-sm font-medium text-foreground">{title}</h3>
          <time className="shrink-0 text-xs text-muted-foreground" dateTime={draft.savedAt}>
            {formatDate(draft.savedAt)}
          </time>
        </div>

        {draft.category ? (
          <p className="mt-2 truncate text-xs text-muted-foreground">{draft.category}</p>
        ) : null}

        {visibleTags.length > 0 ? (
          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
            {visibleTags.map((tag) => (
              <PostTag key={tag} tag={tag} />
            ))}
            {hiddenTagCount > 0 ? (
              <span className="text-xs text-muted-foreground">+{hiddenTagCount}</span>
            ) : null}
          </div>
        ) : null}
      </button>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onRequestDelete(draft)}
        className="mr-3 text-muted-foreground opacity-70 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 sm:mr-4"
        aria-label={`${title} 삭제`}
      >
        <Trash2 />
      </Button>
    </li>
  );
}

function DraftListEmptyState(): React.ReactElement {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <FileText aria-hidden="true" className="size-7 text-muted-foreground/60" />
      <p className="mt-3 text-sm font-medium text-foreground">임시 저장된 글이 없습니다</p>
      <p className="mt-1 text-xs text-muted-foreground">임시 저장한 글은 이곳에서 불러올 수 있습니다.</p>
    </div>
  );
}

type DraftPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function DraftPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DraftPaginationProps): React.ReactElement {
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  function handlePageChange(page: number, event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    onPageChange(page);
  }

  return (
    <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
      <span className="tabular-nums">
        {currentPage} of {totalPages}
      </span>
      <span aria-hidden="true" className="h-4 w-px bg-border" />
      <Pagination className="mx-0 w-auto justify-end" aria-label="임시 저장 글 페이지 이동">
        <PaginationContent className="gap-0">
          <PaginationItem>
            <PaginationLink
              href="#"
              size="icon-xs"
              onClick={(event) => handlePageChange(currentPage - 1, event)}
              aria-disabled={isPreviousDisabled}
              className={isPreviousDisabled ? "pointer-events-none opacity-40" : "cursor-pointer"}
              aria-label="이전 페이지"
            >
              <ChevronLeft />
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <span className="flex size-6 items-center justify-center tabular-nums text-foreground">
              {currentPage}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              size="icon-xs"
              onClick={(event) => handlePageChange(currentPage + 1, event)}
              aria-disabled={isNextDisabled}
              className={isNextDisabled ? "pointer-events-none opacity-40" : "cursor-pointer"}
              aria-label="다음 페이지"
            >
              <ChevronRight />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function DraftListDialog({
  drafts,
  hasUnsavedContent,
  onSelect,
  onDelete,
}: DraftListDialogProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null);
  const [draftToLoad, setDraftToLoad] = useState<Draft | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  function handleOpenChange(open: boolean): void {
    setIsOpen(open);
    if (open) setCurrentPage(1);
    if (!open) {
      setDraftToDelete(null);
      setDraftToLoad(null);
    }
  }

  function handleSelect(draft: Draft): void {
    if (getDraftLoadAction(hasUnsavedContent) === "confirm") {
      setDraftToLoad(draft);
      return;
    }

    onSelect(draft);
    setIsOpen(false);
  }

  function handleConfirmLoad(): void {
    if (!draftToLoad) return;

    onSelect(draftToLoad);
    setDraftToLoad(null);
    setIsOpen(false);
  }

  function handleConfirmDelete(): void {
    if (!draftToDelete) return;

    onDelete(draftToDelete.id);
    setCurrentPage((page) =>
      clampDraftPage(page, getDraftTotalPages(drafts.length - 1, DRAFTS_PER_PAGE)),
    );
    setDraftToDelete(null);
  }

  const deleteTargetTitle = draftToDelete?.title.trim() || "제목 없음";
  const totalPages = getDraftTotalPages(drafts.length, DRAFTS_PER_PAGE);
  const visibleDrafts = getDraftPage(drafts, currentPage, DRAFTS_PER_PAGE);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">불러오기</Button>
        </DialogTrigger>
        <DialogContent className="flex h-[min(720px,calc(100dvh-2rem))] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border px-6 pt-6 pb-5 pr-14 text-left">
            <div className="flex items-start justify-between gap-4">
              <DialogTitle>임시 저장 글</DialogTitle>
              {totalPages > 0 ? (
                <DraftPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              ) : null}
            </div>
            <DialogDescription>
              {drafts.length > 0
                ? `저장된 글 ${drafts.length}개 · 불러올 글을 선택하세요.`
                : "저장된 글이 없습니다."}
            </DialogDescription>
          </DialogHeader>

          {drafts.length > 0 ? (
            <ul className="min-h-0 flex-1 overflow-y-auto">
              {visibleDrafts.map((draft) => (
                <DraftItem
                  key={draft.id}
                  draft={draft}
                  onSelect={handleSelect}
                  onRequestDelete={setDraftToDelete}
                />
              ))}
            </ul>
          ) : (
            <DraftListEmptyState />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={draftToLoad !== null} onOpenChange={(open) => !open && setDraftToLoad(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>임시 저장 글을 불러올까요?</DialogTitle>
            <DialogDescription>
              현재 작성 중인 내용은 사라지며 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDraftToLoad(null)}>
              취소
            </Button>
            <Button type="button" onClick={handleConfirmLoad}>
              불러오기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={draftToDelete !== null} onOpenChange={(open) => !open && setDraftToDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>임시 저장 글을 삭제할까요?</DialogTitle>
            <DialogDescription>
              &lsquo;{deleteTargetTitle}&rsquo; 글은 삭제한 뒤 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDraftToDelete(null)}>
              취소
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
