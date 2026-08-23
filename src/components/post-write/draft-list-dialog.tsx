import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Trash2 } from "lucide-react";
import { PostTag } from "@/components/post/post-tag";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { useToast } from "@/core/toast/toast-context";
import { getDraftLoadAction } from "@/features/post/lib/draft-list";
import { useDeleteDraftMutation } from "@/features/post-write/hooks/mutations/use-delete-draft";
import { useDraftList } from "@/features/post-write/hooks/queries/use-draft-list";
import type { DraftPage } from "@/features/post-write/types/post-write-api.types";

type DraftListItem = DraftPage["content"][number];

type Props = {
  hasUnsavedContent: boolean;
  onSelect: (postId: number) => void;
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function DraftItem({ draft, onSelect, onDelete }: {
  draft: DraftListItem;
  onSelect: (draft: DraftListItem) => void;
  onDelete: (draft: DraftListItem) => void;
}): React.ReactElement {
  const title = draft.title.trim() || "제목 없음";
  const visibleTags = draft.tags.slice(0, 2);
  return (
    <li className="group flex min-w-0 items-center border-b border-border last:border-b-0 hover:bg-muted/40">
      <button type="button" onClick={() => onSelect(draft)} className="min-w-0 flex-1 px-5 py-4 text-left outline-none focus-visible:bg-muted/60 sm:px-6">
        <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <h3 className="truncate text-sm font-medium text-foreground">{title}</h3>
          <time className="shrink-0 text-xs text-muted-foreground" dateTime={draft.updatedAt}>{formatDate(draft.updatedAt)}</time>
        </div>
        {draft.category ? <p className="mt-2 truncate text-xs text-muted-foreground">{draft.category.name}</p> : null}
        {visibleTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {visibleTags.map((tag) => <PostTag key={tag.tagId} tag={tag.name} />)}
            {draft.tags.length > 2 ? <span className="text-xs text-muted-foreground">+{draft.tags.length - 2}</span> : null}
          </div>
        ) : null}
      </button>
      <Button type="button" variant="ghost" size="icon-sm" onClick={() => onDelete(draft)} className="mr-3 text-muted-foreground opacity-70 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 sm:mr-4" aria-label={`${title} 삭제`}>
        <Trash2 />
      </Button>
    </li>
  );
}

function DraftPagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }): React.ReactElement {
  function move(page: number, event: React.MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    if (page >= 1 && page <= totalPages) onPageChange(page);
  }
  return (
    <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
      <span className="tabular-nums">{currentPage} of {totalPages}</span>
      <span aria-hidden="true" className="h-4 w-px bg-border" />
      <Pagination className="mx-0 w-auto justify-end" aria-label="임시 저장 글 페이지 이동">
        <PaginationContent className="gap-0">
          <PaginationItem><PaginationLink href="#" size="icon-xs" onClick={(event) => move(currentPage - 1, event)} aria-disabled={currentPage === 1} className={currentPage === 1 ? "pointer-events-none opacity-40" : "cursor-pointer"} aria-label="이전 페이지"><ChevronLeft /></PaginationLink></PaginationItem>
          <PaginationItem><span className="flex size-6 items-center justify-center tabular-nums text-foreground">{currentPage}</span></PaginationItem>
          <PaginationItem><PaginationLink href="#" size="icon-xs" onClick={(event) => move(currentPage + 1, event)} aria-disabled={currentPage === totalPages} className={currentPage === totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"} aria-label="다음 페이지"><ChevronRight /></PaginationLink></PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function EmptyState(): React.ReactElement {
  return <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center"><FileText className="size-7 text-muted-foreground/60" /><p className="mt-3 text-sm font-medium">임시 저장된 글이 없습니다</p><p className="mt-1 text-xs text-muted-foreground">임시 저장한 글은 이곳에서 불러올 수 있습니다.</p></div>;
}

export function DraftListDialog({ hasUnsavedContent, onSelect }: Props): React.ReactElement {
  const { showErrorToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [draftToLoad, setDraftToLoad] = useState<DraftListItem | null>(null);
  const [draftToDelete, setDraftToDelete] = useState<DraftListItem | null>(null);
  const draftList = useDraftList(currentPage - 1, isOpen);
  const deleteMutation = useDeleteDraftMutation();
  const page = draftList.data;

  function handleOpenChange(open: boolean): void {
    setIsOpen(open);
    if (open) setCurrentPage(1);
    if (!open) { setDraftToLoad(null); setDraftToDelete(null); }
  }

  function requestLoad(draft: DraftListItem): void {
    if (getDraftLoadAction(hasUnsavedContent) === "confirm") setDraftToLoad(draft);
    else { onSelect(draft.postId); setIsOpen(false); }
  }

  function confirmLoad(): void {
    if (!draftToLoad) return;
    onSelect(draftToLoad.postId);
    setDraftToLoad(null);
    setIsOpen(false);
  }

  async function confirmDelete(): Promise<void> {
    if (!draftToDelete) return;
    try {
      await deleteMutation.mutateAsync(draftToDelete.postId);
      if (page?.content.length === 1 && currentPage > 1) setCurrentPage((value) => value - 1);
      setDraftToDelete(null);
    } catch (error) {
      showErrorToast({ title: "임시저장 글 삭제 실패", error, fallback: "임시저장 글을 삭제하지 못했습니다." });
    }
  }

  const totalPages = Math.max(page?.totalPages ?? 1, 1);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild><Button variant="outline">불러오기</Button></DialogTrigger>
        <DialogContent className="flex h-[min(720px,calc(100dvh-2rem))] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogHeader className="border-b border-border px-6 pt-6 pb-5 pr-14 text-left">
            <div className="flex items-start justify-between gap-4"><DialogTitle>임시 저장 글</DialogTitle>{page && page.totalPages > 0 ? <DraftPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : null}</div>
            <DialogDescription>{page ? `저장된 글 ${page.totalElements}개 · 불러올 글을 선택하세요.` : "임시 저장 글을 불러오고 있습니다."}</DialogDescription>
          </DialogHeader>
          {draftList.isLoading ? <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">목록을 불러오는 중...</div> : null}
          {draftList.isError ? <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-destructive"><p>임시저장 목록을 불러오지 못했습니다.</p><Button variant="outline" size="sm" onClick={() => draftList.refetch()}>다시 시도</Button></div> : null}
          {page && page.content.length > 0 ? <ul className="min-h-0 flex-1 overflow-y-auto">{page.content.map((draft) => <DraftItem key={draft.postId} draft={draft} onSelect={requestLoad} onDelete={setDraftToDelete} />)}</ul> : null}
          {page && page.content.length === 0 ? <EmptyState /> : null}
        </DialogContent>
      </Dialog>

      <Dialog open={draftToLoad !== null} onOpenChange={(open) => !open && setDraftToLoad(null)}><DialogContent className="sm:max-w-sm"><DialogHeader><DialogTitle>임시 저장 글을 불러올까요?</DialogTitle><DialogDescription>현재 작성 중인 내용은 사라지며 복구할 수 없습니다.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setDraftToLoad(null)}>취소</Button><Button onClick={confirmLoad}>불러오기</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={draftToDelete !== null} onOpenChange={(open) => !open && setDraftToDelete(null)}><DialogContent className="sm:max-w-sm"><DialogHeader><DialogTitle>임시 저장 글을 삭제할까요?</DialogTitle><DialogDescription>&lsquo;{draftToDelete?.title.trim() || "제목 없음"}&rsquo; 글은 삭제한 뒤 복구할 수 없습니다.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" disabled={deleteMutation.isPending} onClick={() => setDraftToDelete(null)}>취소</Button><Button variant="destructive" disabled={deleteMutation.isPending} onClick={confirmDelete}>{deleteMutation.isPending ? "삭제 중..." : "삭제"}</Button></DialogFooter></DialogContent></Dialog>
    </>
  );
}
