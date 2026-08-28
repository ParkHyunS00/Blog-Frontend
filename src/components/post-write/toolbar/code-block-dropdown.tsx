import { useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import { RiCodeBoxLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { ACTIVE_CLASS } from "@/components/post-write/toolbar/toolbar-primitives";

const CODE_LANGUAGES = [
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "Bash", value: "bash" },
  { label: "SQL", value: "sql" },
  { label: "JSON", value: "json" },
  { label: "YAML", value: "yaml" },
  { label: "Dockerfile", value: "dockerfile" },
] as const;

type Props = {
  editor: Editor;
};

export function CodeBlockDropdown({ editor }: Props): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function handleToggle(): void {
    if (editor.isActive("codeBlock")) {
      editor.chain().focus().toggleCodeBlock().run();
      return;
    }
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left });
    }
    setIsOpen((prev) => !prev);
  }

  function handleSelect(language: string): void {
    editor.chain().focus().toggleCodeBlock().run();
    if (editor.isActive("codeBlock")) {
      editor.chain().focus().updateAttributes("codeBlock", { language }).run();
    }
    setIsOpen(false);
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        title="코드 블록"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
          editor.isActive("codeBlock") && ACTIVE_CLASS,
        )}
      >
        <RiCodeBoxLine size={18} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className="fixed z-50 w-40 rounded-lg border border-border bg-background py-1 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            {CODE_LANGUAGES.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleSelect(value)}
                className="flex w-full items-center px-3 py-1.5 text-sm transition-colors hover:bg-secondary"
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
