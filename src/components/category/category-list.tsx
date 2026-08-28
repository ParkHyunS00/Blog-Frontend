import { useSearchParams } from "react-router-dom";
import { CategoryItem } from "@/components/category/category-item";
import type { Category } from "@/features/category/types/category.types";
import {
  getSelectedCategorySlug,
  searchParamsForCategory,
} from "@/features/post/lib/post-list-search-params";

type CategoryListProps = {
  categories: Category[];
  onSelect?: () => void;
};

export function CategoryList({
  categories,
  onSelect,
}: CategoryListProps): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = getSelectedCategorySlug(searchParams);

  function handleItemClick(slug: string | null): void {
    setSearchParams(searchParamsForCategory(searchParams, slug));
    onSelect?.();
  }

  return (
    <>
      <h2 className="text-center text-sm font-bold tracking-widest text-foreground">
        CATEGORIES
      </h2>
      <hr className="my-3 border-border" />
      <nav className="flex flex-col gap-0.5">
        {categories.map((category) => (
          <CategoryItem
            key={category.name}
            name={category.name}
            count={category.count}
            variant={category.name === "ALL" ? "all" : "default"}
            selected={selectedCategorySlug === category.slug}
            onClick={() => handleItemClick(category.slug)}
          />
        ))}
      </nav>
    </>
  );
}
