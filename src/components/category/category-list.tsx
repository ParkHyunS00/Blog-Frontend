import { useSearchParams } from "react-router-dom";
import { CategoryItem } from "@/components/category/category-item";
import { useCategoryStore } from "@/core/stores/use-category-store";
import type { Category } from "@/features/category/types/category.types";

type CategoryListProps = {
  categories: Category[];
  onSelect?: () => void;
};

export function CategoryList({
  categories,
  onSelect,
}: CategoryListProps): React.ReactElement {
  const [, setSearchParams] = useSearchParams();
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const setSelectedCategory = useCategoryStore(
    (state) => state.setSelectedCategory,
  );

  function handleItemClick(name: string): void {
    setSelectedCategory(name);
    setSearchParams({});
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
            selected={selectedCategory === category.name}
            onClick={() => handleItemClick(category.name)}
          />
        ))}
      </nav>
    </>
  );
}
