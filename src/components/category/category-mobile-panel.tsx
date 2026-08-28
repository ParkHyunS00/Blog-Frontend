import { useEffect } from "react";
import { CategoryList } from "@/components/category/category-list";
import { CategoryListSkeleton } from "@/components/category/category-list-skeleton";
import type { Category } from "@/features/category/types/category.types";

type CategoryMobilePanelProps = {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onClose: () => void;
};

export function CategoryMobilePanel({
  categories,
  isLoading,
  isError,
  onRetry,
  onClose,
}: CategoryMobilePanelProps): React.ReactElement {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute bottom-0 left-0 top-0 w-64 bg-background p-5 shadow-xl">
        {isLoading ? <CategoryListSkeleton /> : null}
        {isError ? (
          <div className="px-2 text-center text-sm text-muted-foreground">
            <p>카테고리를 불러오지 못했습니다.</p>
            <button type="button" onClick={onRetry} className="mt-2 text-[#305CEC] dark:text-[#5B7FFF]">
              다시 시도
            </button>
          </div>
        ) : null}
        {!isLoading && !isError ? (
          <CategoryList categories={categories} onSelect={onClose} />
        ) : null}
      </div>
    </div>
  );
}
