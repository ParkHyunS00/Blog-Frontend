import { cn } from "@/lib/utils";
import type { TocItem } from "@/features/post/types/post.types";

type PostDetailTocProps = {
  items: TocItem[];
  activeId: string | null;
  onItemClick: (id: string) => void;
};

export function PostDetailToc({ items, activeId, onItemClick }: PostDetailTocProps): React.ReactElement {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string): void {
    e.preventDefault();
    onItemClick(id);
  }

  return (
    <nav className="hidden h-full min-[1344px]:block" aria-label="목차">
      <div className="sticky top-40 w-48">
        <div className="relative pl-4">
          <span className="absolute left-0 top-0 h-full w-0.5 bg-border" />
          <ul className="relative space-y-2">
            {items.map((item) => {
              const isActive = activeId === item.id;

              return (
                <li key={item.id} className="relative">
                  {isActive ? <span className="absolute -left-4 top-0 h-full w-0.5 bg-[#305CEC] dark:bg-[#5B7FFF]" /> : null}
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className={cn(
                      "block origin-left text-sm font-medium transition-[transform,color] duration-200",
                      item.level === 3 && "pl-3",
                      isActive
                        ? "scale-[1.08] text-foreground"
                        : item.level === 3
                          ? "text-muted-foreground hover:text-[#305CEC] dark:hover:text-[#5B7FFF]"
                          : "text-muted-foreground hover:text-[#305CEC] dark:hover:text-[#5B7FFF]",
                    )}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
