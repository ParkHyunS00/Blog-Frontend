import { useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import { RiLink, RiCheckLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { ACTIVE_CLASS } from "@/components/post-write/toolbar/toolbar-primitives";

type Props = {
  editor: Editor;
};

export function LinkButton({ editor }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function handleToggle(): void {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setUrl("");
    setIsOpen((prev) => !prev);
  }

  function handleSubmit(): void {
    if (!url.trim()) return;
    const href = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
    editor.chain().focus().setLink({ href, target: "_blank" }).run();
    setIsOpen(false);
    setUrl("");
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        title="링크"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
          editor.isActive("link") && ACTIVE_CLASS,
        )}
      >
        <RiLink size={18} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-50 w-72 rounded-lg border border-border bg-background p-3 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            <p className="mb-2 text-xs text-muted-foreground">링크 URL</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                className="h-8 flex-1 rounded-md border border-border bg-transparent px-2 text-sm outline-none focus:border-ring"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSubmit}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RiCheckLine size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
