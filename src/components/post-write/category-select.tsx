import { useState } from "react";
import { RiArrowDownSLine, RiAddLine, RiCheckLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
};

export function CategorySelect({ value, onChange, categories }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  function handleSelect(category: string): void {
    onChange(category);
    setIsOpen(false);
  }

  function handleCreateSubmit(): void {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setNewCategory("");
    setIsCreating(false);
    setIsOpen(false);
  }

  function handleCreateKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateSubmit();
    }
    if (e.key === "Escape") {
      setIsCreating(false);
      setNewCategory("");
    }
  }

  function handleToggle(): void {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setIsCreating(false);
      setNewCategory("");
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-4 text-sm transition-colors hover:border-ring",
          value ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <span>{value || "카테고리 선택"}</span>
        <RiArrowDownSLine
          size={18}
          className={cn("text-muted-foreground transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          <div className="max-h-48 overflow-y-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelect(cat)}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-secondary",
                  value === cat && "text-[#305CEC] dark:text-[#5B7FFF]"
                )}
              >
                {value === cat && <RiCheckLine size={16} />}
                <span className={cn(value !== cat && "pl-6")}>{cat}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-border p-2">
            {isCreating ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={handleCreateKeyDown}
                  placeholder="새 카테고리 입력"
                  className="h-8 flex-1 rounded-md border border-border bg-transparent px-3 text-sm outline-none focus:border-ring"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateSubmit}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <RiCheckLine size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <RiAddLine size={16} />
                새 카테고리 추가
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
