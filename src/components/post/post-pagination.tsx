import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPageNumbers } from "@/features/post/lib/get-page-numbers";
import type { PageItem } from "@/features/post/lib/get-page-numbers";

type PostPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

/* patterns-explicit-variants: separate variant components for page number vs ellipsis */
type PageNumberItemProps = {
  page: number;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
};

function PageNumberItem({ page, isActive, onClick }: PageNumberItemProps): React.ReactElement {
  return (
    <PaginationItem>
      <PaginationLink href="#" isActive={isActive} onClick={onClick} className="cursor-pointer">
        {page}
      </PaginationLink>
    </PaginationItem>
  );
}

function renderPageItem(
  item: PageItem,
  index: number,
  currentPage: number,
  onPageClick: (page: number) => (e: React.MouseEvent) => void,
): React.ReactElement {
  /* rendering-conditional-render: explicit ternary instead of && */
  return item === "ellipsis" ? (
    <PaginationItem key={`ellipsis-${index}`}>
      <PaginationEllipsis />
    </PaginationItem>
  ) : (
    <PageNumberItem key={item} page={item} isActive={item === currentPage} onClick={onPageClick(item)} />
  );
}

export function PostPagination({ currentPage, totalPages, onPageChange }: PostPaginationProps): React.ReactElement {
  /* rendering-conditional-render: explicit ternary for early return */
  if (totalPages <= 1) {
    return <></>;
  }

  /* rerender-derived-state-no-effect: derived during render, not in state */
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  function handlePrevious(e: React.MouseEvent): void {
    e.preventDefault();
    if (!isPreviousDisabled) {
      onPageChange(currentPage - 1);
    }
  }

  function handleNext(e: React.MouseEvent): void {
    e.preventDefault();
    if (!isNextDisabled) {
      onPageChange(currentPage + 1);
    }
  }

  function handlePageClick(page: number): (e: React.MouseEvent) => void {
    return function (e: React.MouseEvent): void {
      e.preventDefault();
      onPageChange(page);
    };
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            className={isPreviousDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {pageNumbers.map((item, index) => renderPageItem(item, index, currentPage, handlePageClick))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            className={isNextDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
