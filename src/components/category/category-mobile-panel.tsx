import { useEffect } from "react";
import { CategoryList } from "@/components/category/category-list";
import type { Category } from "@/features/category/types/category.types";

type CategoryMobilePanelProps = {
  categories: Category[];
  onClose: () => void;
};

export function CategoryMobilePanel({
  categories,
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
        <CategoryList categories={categories} onSelect={onClose} />
      </div>
    </div>
  );
}
