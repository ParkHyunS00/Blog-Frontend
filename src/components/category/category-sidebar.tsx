import { CategoryList } from "@/components/category/category-list";
import type { Category } from "@/features/category/types/category.types";

type CategorySidebarProps = {
  categories: Category[];
};

export function CategorySidebar({
  categories,
}: CategorySidebarProps): React.ReactElement {
  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <div className="sticky top-24 p-5">
        <CategoryList categories={categories} />
      </div>
    </aside>
  );
}
