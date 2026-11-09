import { useFitMath } from "@/features/post/hooks/use-fit-math";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MATH_MAX_LENGTH, renderMath } from "@/features/post/lib/post-math";

import { Sigma, Eye, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { insertMathShortcut, mathShortcutGroups, type MathShortcut } from "./math-shortcuts";

export type MathDraft = { from: number; to: number; latex: string; block: boolean; editing: boolean };

export function MathDialog({
  editor,
  draft,
  onClose,
}: {
  editor: Editor;
  draft: MathDraft;
  onClose: () => void;
}): React.ReactElement {
  const [latex, setLatex] = useState(draft.latex);
  const [block, setBlock] = useState(draft.block);
  const [submitError, setSubmitError] = useState("");
  const id = useId();
  const mathRoot = useFitMath();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const rangeRef = useRef({ from: draft.latex.length, to: draft.latex.length });
  const pendingRange = useRef<{ from: number; to: number } | null>(null);
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "0px";
    input.style.height = `${Math.min(160, Math.max(72, input.scrollHeight))}px`;
  }, [latex]);

  useLayoutEffect(() => {
    if (!pendingRange.current || !inputRef.current) return;
    inputRef.current.focus({ preventScroll: true });
    inputRef.current.setSelectionRange(pendingRange.current.from, pendingRange.current.to);
    pendingRange.current = null;
  }, [latex]);

  function insertShortcut(shortcut: MathShortcut): void {
    const next = insertMathShortcut(latex, rangeRef.current.from, rangeRef.current.to, shortcut);
    if (next.value.length > MATH_MAX_LENGTH) {
      setSubmitError("수식은 5,000자까지 입력할 수 있습니다.");
      return;
    }
    setSubmitError("");
    if (next.value === latex) {
      inputRef.current?.focus({ preventScroll: true });
      inputRef.current?.setSelectionRange(next.from, next.to);
      return;
    }
    pendingRange.current = next;
    setLatex(next.value);
  }
  const preview = useMemo(() => {
    if (!latex.trim()) return { html: "", error: "" };
    try {
      return { html: renderMath(latex, block), error: "" };
    } catch {
      return { html: "", error: "수식 문법을 확인해 주세요. 예: \\frac{a}{b}, x^2" };
    }
  }, [latex, block]);

  function save(): void {
    if (!latex.trim() || preview.error) return;
    const success = editor
      .chain()
      .insertContentAt(
        { from: draft.from, to: draft.to },
        {
          type: block ? "blockMath" : "inlineMath",
          attrs: { latex: latex.trim() },
        },
      )
      .run();
    if (success) onClose();
    else setSubmitError("이 위치에는 수식을 넣을 수 없습니다. 본문에서 다시 시도해 주세요.");
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-h-[90dvh] gap-3 overflow-y-auto p-5 sm:max-w-2xl [scrollbar-width:thin] [scrollbar-color:var(--border)_transparent]"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(draft.latex.length, draft.latex.length);
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          editor.commands.focus(undefined, { scrollIntoView: false });
        }}
      >
        <div className="flex items-start gap-3 pr-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sigma size={22} />
          </div>
          <div className="space-y-2">
            <DialogTitle>{draft.editing ? "수식 수정" : "수식 삽입"}</DialogTitle>
            <DialogDescription>기호를 골라 수식을 만들고, 아래에서 결과를 확인하세요.</DialogDescription>
          </div>
        </div>
        <fieldset className="flex gap-1 rounded-lg bg-muted p-1" disabled={draft.editing}>
          <legend className="sr-only">수식 배치</legend>
          {[
            { value: false, label: "본문 안에", hint: "문장과 나란히" },
            { value: true, label: "별도 줄에", hint: "독립된 수식으로" },
          ].map((option) => (
            <label
              key={option.label}
              className={cn(
                "relative flex flex-1 cursor-pointer flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-md px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                block === option.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                draft.editing && "cursor-default",
              )}
            >
              <input
                className="sr-only"
                type="radio"
                name={id}
                checked={block === option.value}
                onChange={() => setBlock(option.value)}
              />
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.hint}</span>
            </label>
          ))}
        </fieldset>
        <div className="space-y-2 rounded-xl border border-border p-3 sm:p-4">
          {mathShortcutGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="w-16 shrink-0 text-xs font-medium text-muted-foreground">{group.label}</span>
              <div role="group" aria-label={group.label} className="flex flex-wrap gap-1.5">
                {group.items.map((shortcut) => (
                  <button
                    key={shortcut.label}
                    type="button"
                    title={shortcut.label}
                    aria-label={shortcut.label}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => insertShortcut(shortcut)}
                    className="flex h-8 min-w-9 items-center justify-center rounded-md border border-border bg-background px-2 font-serif text-lg transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {shortcut.symbol}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div
            className={cn(
              "overflow-hidden rounded-lg border bg-muted/20 transition-colors focus-within:border-primary/50 focus-within:bg-muted/30",
              preview.error ? "border-destructive/60" : "border-border",
            )}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-3.5 py-2">
              <label htmlFor={`${id}-latex`} className="flex items-center gap-2 text-sm font-medium">
                <Code2 size={15} className="text-muted-foreground" />
                수식 입력
              </label>
              <div className="flex items-center gap-3">
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {latex.length.toLocaleString()} / {MATH_MAX_LENGTH.toLocaleString()}
                </span>
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide text-muted-foreground">
                  LaTeX
                </span>
              </div>
            </div>
            <textarea
              ref={inputRef}
              id={`${id}-latex`}
              value={latex}
              onSelect={(event) => {
                rangeRef.current = { from: event.currentTarget.selectionStart, to: event.currentTarget.selectionEnd };
              }}
              onChange={(event) => {
                setLatex(event.target.value);
                setSubmitError("");
              }}
              maxLength={MATH_MAX_LENGTH}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={!!preview.error}
              aria-describedby={`${id}-help ${id}-error`}
              placeholder={"예: a \\times b 또는 \\frac{a}{b}"}
              className="math-source-input"
              rows={3}
              onKeyDown={(event) => {
                if (!event.nativeEvent.isComposing && (event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  save();
                }
              }}
            />
          </div>
          <p id={`${id}-help`} className="text-xs text-muted-foreground">
            커서 위치에 기호를 넣습니다. 글자를 선택하고 분수·제곱근을 누르면 선택한 내용을 감쌉니다.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-muted/20">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
            <Eye size={14} />
            미리보기
          </div>
          <div
            ref={mathRoot}
            className="math-preview flex min-h-20 items-center justify-center p-4"
            aria-label="수식 미리보기"
          >
            {preview.html ? (
              <div className="max-w-full [&_.katex-display]:m-0" dangerouslySetInnerHTML={{ __html: preview.html }} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {latex.trim() ? "입력 중인 수식을 확인해 주세요." : "기호 버튼을 누르거나 수식을 입력해 보세요."}
              </p>
            )}
          </div>
        </div>
        <p
          id={`${id}-error`}
          aria-live="polite"
          className={cn("text-xs text-destructive", !preview.error && "sr-only")}
        >
          {preview.error}
        </p>
        {submitError && (
          <p role="alert" className="text-sm text-destructive">
            {submitError}
          </p>
        )}
        <DialogFooter className="items-center border-t border-border pt-3">
          <span className="mr-auto hidden text-xs text-muted-foreground sm:block">Ctrl / ⌘ + Enter로 적용</span>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button disabled={!latex.trim() || !!preview.error} onClick={save}>
            {draft.editing ? "수정 적용" : "수식 삽입"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
