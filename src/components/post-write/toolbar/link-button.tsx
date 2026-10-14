import { useId, useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import { RiLink, RiCheckLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { insertEditorLink, normalizeLinkUrl } from "../editor-link";
import { ACTIVE_CLASS } from "@/components/post-write/toolbar/toolbar-primitives";

type Props = {
  editor: Editor;
};

export function LinkButton({ editor }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const rangeRef = useRef({ from: 1, to: 1 });
  const inputId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function handleToggle(): void {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: Math.max(8, Math.min(rect.left, window.innerWidth - 328)) });
    }
    const { from, to } = editor.state.selection;
    rangeRef.current = { from, to };
    setLabel(editor.state.doc.textBetween(from, to, " "));
    setError("");
    setUrl("");
    setIsOpen((prev) => !prev);
  }

  function handleSubmit(): void {
    const href = normalizeLinkUrl(url);
    if (!href) { setError("올바른 http 또는 https 주소를 입력해 주세요."); return; }
    if (!insertEditorLink(editor, rangeRef.current, href, label)) return;
    editor.commands.focus();
    setIsOpen(false);
    setUrl("");
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.nativeEvent.isComposing) return;
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
            className="fixed z-50 w-80 max-w-[calc(100vw-1rem)] rounded-lg border border-border bg-background p-3 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            <label htmlFor={inputId} className="mb-2 block text-xs text-muted-foreground">링크 URL</label>
            <div className="flex items-center gap-2">
              <input
                id={inputId}
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={!!error}
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com"
                className="h-8 min-w-0 flex-1 rounded-md border border-border bg-transparent px-2 text-sm outline-none focus:border-ring"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSubmit}
                aria-label="링크 삽입"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RiCheckLine size={16} />
              </button>
            </div>
            <label htmlFor={`${inputId}-label`} className="mt-3 mb-2 block text-xs text-muted-foreground">표시할 텍스트 (선택)</label>
            <input id={`${inputId}-label`} autoComplete="off" value={label} onChange={(e) => setLabel(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="예: 검색 결과 보기 (비워두면 주소 표시)"
              className="h-8 w-full rounded-md border border-border bg-transparent px-2 text-sm outline-none focus:border-ring" />
            <p className="mt-2 text-xs text-muted-foreground">긴 주소는 앞부분만 표시하고 끝에 ...을 붙입니다. 실제 연결 주소는 그대로 유지됩니다.</p>
            {error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}
          </div>
        </>
      )}
    </>
  );
}
