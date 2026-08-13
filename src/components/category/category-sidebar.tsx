import { CategoryList } from "@/components/category/category-list";
import { CategoryListSkeleton } from "@/components/category/category-list-skeleton";
import type { Category } from "@/features/category/types/category.types";

type CategorySidebarProps = {
  categories: Category[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function CategorySidebar({
  categories,
  isLoading,
  isError,
  onRetry,
}: CategorySidebarProps): React.ReactElement {
  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <div className="sticky top-24 p-5">
        {isLoading ? <CategoryListSkeleton /> : null}
        {isError ? (
          <div className="px-2 text-center text-sm text-muted-foreground">
            <p>카테고리를 불러오지 못했습니다.</p>
            <button type="button" onClick={onRetry} className="mt-2 text-[#305CEC] dark:text-[#5B7FFF]">
              다시 시도
            </button>
          </div>
        ) : null}
        {!isLoading && !isError ? <CategoryList categories={categories} /> : null}
      </div>
    </aside>
  );
}
