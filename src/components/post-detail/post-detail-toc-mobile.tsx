import { useState, useEffect } from "react";
import { RiListUnordered } from "@remixicon/react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/features/post/types/post.types";

type PostDetailTocMobileProps = {
  items: TocItem[];
  activeId: string | null;
  onItemClick: (id: string) => void;
};

export function PostDetailTocMobile({
  items,
  activeId,
  onItemClick,
}: PostDetailTocMobileProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleItemClick(id: string): void {
    setIsOpen(false);
    setTimeout(() => {
      onItemClick(id);
    }, 100);
  }

  return (
    <div className="min-[1344px]:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed top-18 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#305CEC] text-white shadow-lg transition-colors hover:bg-[#2549c4] dark:bg-[#5B7FFF] dark:hover:bg-[#4a6be0]"
        aria-label="목차 열기"
      >
        <RiListUnordered size={22} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[60vh] overflow-y-auto rounded-t-2xl bg-background p-6 shadow-xl">
            <p className="mb-4 text-sm font-semibold text-foreground">목차</p>
            <ul className="space-y-3">
              {items.map((item) => {
                const isActive = activeId === item.id;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "w-full origin-left text-left text-sm transition-[transform,color] duration-200 hover:text-[#305CEC] dark:hover:text-[#5B7FFF]",
                        item.level === 3 ? "pl-4" : "font-medium",
                        isActive
                          ? "scale-[1.08] text-foreground"
                          : item.level === 3
                            ? "text-muted-foreground"
                            : "text-foreground",
                      )}
                    >
                      {item.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
