import { useState } from "react";
import { CategorySidebar } from "@/components/category/category-sidebar";
import { CategoryFloatingButton } from "@/components/category/category-floating-button";
import { CategoryMobilePanel } from "@/components/category/category-mobile-panel";
import { getCategories } from "@/features/category/lib/get-categories";
import { mockPosts } from "@/features/post/lib/mock-posts";

type PageLayoutProps = {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
};

const categories = getCategories(mockPosts);

export function PageLayout({
  children,
  rightSidebar,
}: PageLayoutProps): React.ReactElement {
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  return (
    <main className="mx-auto flex max-w-screen-2xl gap-1 px-4 py-8">
      <CategorySidebar categories={categories} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl">{children}</div>
      </div>
      {rightSidebar}
      <CategoryFloatingButton onClick={() => setIsMobilePanelOpen(true)} />
      {isMobilePanelOpen && (
        <CategoryMobilePanel
          categories={categories}
          onClose={() => setIsMobilePanelOpen(false)}
        />
      )}
    </main>
  );
}
