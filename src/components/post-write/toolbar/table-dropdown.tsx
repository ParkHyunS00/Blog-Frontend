import { useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import {
  RiTableLine,
  RiInsertRowBottom,
  RiInsertColumnRight,
  RiDeleteRow,
  RiDeleteColumn,
  RiDeleteBinLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { ACTIVE_CLASS } from "@/components/post-write/toolbar/toolbar-primitives";

type Props = {
  editor: Editor;
};

export function TableDropdown({ editor }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const isInTable = editor.isActive("table");

  function handleToggle(): void {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setIsOpen((prev) => !prev);
  }

  function run(action: () => void): void {
    action();
    setIsOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        title="표"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
          isInTable && ACTIVE_CLASS,
        )}
      >
        <RiTableLine size={18} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-50 w-44 rounded-lg border border-border bg-background py-1 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            {!isInTable ? (
              <button
                type="button"
                onClick={() => run(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
              >
                <RiTableLine size={16} className="text-muted-foreground" />
                표 삽입 (3×3)
              </button>
            ) : (
              <>
                <button type="button" onClick={() => run(() => editor.chain().focus().addRowAfter().run())} className="flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
                  <RiInsertRowBottom size={16} className="text-muted-foreground" />행 추가
                </button>
                <button type="button" onClick={() => run(() => editor.chain().focus().addColumnAfter().run())} className="flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
                  <RiInsertColumnRight size={16} className="text-muted-foreground" />열 추가
                </button>
                <div className="my-1 border-t border-border" />
                <button type="button" onClick={() => run(() => editor.chain().focus().deleteRow().run())} className="flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
                  <RiDeleteRow size={16} className="text-muted-foreground" />행 삭제
                </button>
                <button type="button" onClick={() => run(() => editor.chain().focus().deleteColumn().run())} className="flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-secondary">
                  <RiDeleteColumn size={16} className="text-muted-foreground" />열 삭제
                </button>
                <div className="my-1 border-t border-border" />
                <button type="button" onClick={() => run(() => editor.chain().focus().deleteTable().run())} className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-secondary">
                  <RiDeleteBinLine size={16} />표 삭제
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
