import { useState } from "react";
import { CategorySidebar } from "@/components/category/category-sidebar";
import { CategoryFloatingButton } from "@/components/category/category-floating-button";
import { CategoryMobilePanel } from "@/components/category/category-mobile-panel";
import type { Category } from "@/features/category/types/category.types";

type PageLayoutProps = {
  children: React.ReactNode;
  categories: Category[];
  isCategoriesLoading: boolean;
  isCategoriesError: boolean;
  onCategoriesRetry: () => void;
  rightSidebar?: React.ReactNode;
};

export function PageLayout({
  children,
  categories,
  isCategoriesLoading,
  isCategoriesError,
  onCategoriesRetry,
  rightSidebar,
}: PageLayoutProps): React.ReactElement {
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl gap-1 px-4 py-8 md:gap-20">
      <CategorySidebar
        categories={categories}
        isLoading={isCategoriesLoading}
        isError={isCategoriesError}
        onRetry={onCategoriesRetry}
      />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
      <div className="hidden w-56 shrink-0 md:block" aria-hidden="true" />
      {rightSidebar}
      <CategoryFloatingButton onClick={() => setIsMobilePanelOpen(true)} />
      {isMobilePanelOpen && (
        <CategoryMobilePanel
          categories={categories}
          isLoading={isCategoriesLoading}
          isError={isCategoriesError}
          onRetry={onCategoriesRetry}
          onClose={() => setIsMobilePanelOpen(false)}
        />
      )}
    </main>
  );
}
