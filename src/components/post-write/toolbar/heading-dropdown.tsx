import { useState } from "react";
import { type Editor } from "@tiptap/react";
import { RiHeading, RiArrowDownSLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { ACTIVE_CLASS } from "@/components/post-write/toolbar/toolbar-primitives";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6] as const;
type HeadingLevel = (typeof HEADING_LEVELS)[number];

type Props = {
  editor: Editor;
};

export function HeadingDropdown({ editor }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  function getActiveLevel(): HeadingLevel | null {
    for (const level of HEADING_LEVELS) {
      if (editor.isActive("heading", { level })) return level;
    }
    return null;
  }

  function handleSelect(level: HeadingLevel): void {
    editor.chain().focus().toggleHeading({ level }).run();
    setIsOpen(false);
  }

  function handleParagraph(): void {
    editor.chain().focus().setNode("paragraph").run();
    setIsOpen(false);
  }

  const activeLevel = getActiveLevel();
  const label = activeLevel ? `H${activeLevel}` : "본문";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex h-8 items-center gap-0.5 rounded-md px-2 text-sm transition-colors",
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
          activeLevel && ACTIVE_CLASS,
        )}
        title="제목 스타일"
      >
        <RiHeading size={16} />
        <span className="min-w-6 text-center text-xs font-medium">{label}</span>
        <RiArrowDownSLine size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-30 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          <div className="py-1">
            <button
              type="button"
              onClick={handleParagraph}
              className={cn(
                "flex w-full items-center px-3 py-1.5 text-sm transition-colors hover:bg-secondary",
                !activeLevel && "text-[#305CEC] dark:text-[#5B7FFF]",
              )}
            >
              본문
            </button>
            {HEADING_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleSelect(level)}
                className={cn(
                  "flex w-full items-center px-3 py-1.5 transition-colors hover:bg-secondary",
                  activeLevel === level && "text-[#305CEC] dark:text-[#5B7FFF]",
                )}
                style={{ fontSize: `${1.1 - level * 0.08}rem`, fontWeight: level <= 3 ? 700 : 600 }}
              >
                H{level}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
