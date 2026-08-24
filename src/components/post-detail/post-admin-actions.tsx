import { useState } from "react";
import { RiDeleteBinLine, RiEditLine } from "@remixicon/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PostAdminActionsProps = {
  postId: number;
  postTitle: string;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
};

export function PostAdminActions({
  postId,
  postTitle,
  isDeleting,
  onDelete,
}: PostAdminActionsProps): React.ReactElement {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function handleOpenChange(open: boolean): void {
    if (!isDeleting) setIsDeleteDialogOpen(open);
  }

  async function handleDelete(): Promise<void> {
    try {
      await onDelete();
      setIsDeleteDialogOpen(false);
    } catch {
      // 오류 피드백은 호출하는 페이지에서 표시하고, 재시도를 위해 모달을 유지한다.
    }
  }

  return (
    <div
      className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground"
      aria-label="게시글 관리"
    >
      <Link
        to={`/admin/posts/${postId}/edit`}
        className="flex items-center gap-1 rounded-sm px-1 py-0.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RiEditLine size={14} aria-hidden="true" />
        수정
      </Link>

      <Dialog open={isDeleteDialogOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 rounded-sm px-1 py-0.5 transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
          >
            <RiDeleteBinLine size={14} aria-hidden="true" />
            삭제
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>게시글을 삭제할까요?</DialogTitle>
            <DialogDescription>
              &lsquo;{postTitle}&rsquo; 게시글은 삭제한 뒤 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isDeleting}>
                취소
              </Button>
            </DialogClose>
            <Button type="button" variant="destructive" disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
