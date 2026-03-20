import { useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import { RiMarkPenLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { ACTIVE_CLASS } from "@/components/post-write/toolbar/toolbar-primitives";

const HIGHLIGHT_COLORS = [
  { label: "노랑", color: "#fde047" },
  { label: "초록", color: "#86efac" },
  { label: "파랑", color: "#93c5fd" },
  { label: "분홍", color: "#fda4af" },
  { label: "보라", color: "#c4b5fd" },
  { label: "주황", color: "#fdba74" },
] as const;

type Props = {
  editor: Editor;
};

export function HighlightDropdown({ editor }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function handleToggle(): void {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setIsOpen((prev) => !prev);
  }

  function handleSelect(color: string): void {
    editor.chain().focus().toggleHighlight({ color }).run();
    setIsOpen(false);
  }

  function handleRemove(): void {
    editor.chain().focus().unsetHighlight().run();
    setIsOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        title="형광펜"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
          editor.isActive("highlight") && ACTIVE_CLASS,
        )}
      >
        <RiMarkPenLine size={18} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-50 rounded-lg border border-border bg-background p-2 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="grid grid-cols-3 gap-1.5">
              {HIGHLIGHT_COLORS.map(({ label, color }) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSelect(color)}
                  title={label}
                  className={cn(
                    "h-7 w-7 rounded-md border transition-colors hover:scale-110",
                    editor.isActive("highlight", { color }) ? "border-foreground" : "border-transparent",
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {editor.isActive("highlight") ? (
              <button
                type="button"
                onClick={handleRemove}
                className="mt-1.5 w-full rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                제거
              </button>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}
