import { useRef, useState } from "react";
import { type Editor } from "@tiptap/react";
import { RiImageAddLine, RiCheckLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

type Props = {
  editor: Editor;
};

export function ImageButton({ editor }: Props): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCaption, setShowCaption] = useState(false);
  const [captionValue, setCaptionValue] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick(): void {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      setCaptionValue("");
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPos({ top: rect.bottom + 4, left: rect.left });
      }
      setShowCaption(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleInsert(): void {
    editor.chain().focus().setImageWithCaption({ src: imageSrc, caption: captionValue }).run();
    setShowCaption(false);
    setImageSrc("");
    setCaptionValue("");
  }

  function handleSkip(): void {
    editor.chain().focus().setImageWithCaption({ src: imageSrc, caption: "" }).run();
    setShowCaption(false);
    setImageSrc("");
    setCaptionValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInsert();
    }
    if (e.key === "Escape") {
      handleSkip();
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        title="이미지"
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <RiImageAddLine size={18} />
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {showCaption && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleSkip} />
          <div
            className="fixed z-50 w-64 rounded-lg border border-border bg-background p-3 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            <p className="mb-2 text-xs text-muted-foreground">이미지 출처 (선택)</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={captionValue}
                onChange={(e) => setCaptionValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="출처를 입력하세요"
                className="h-8 flex-1 rounded-md border border-border bg-transparent px-2 text-sm outline-none focus:border-ring"
                autoFocus
              />
              <button
                type="button"
                onClick={handleInsert}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RiCheckLine size={16} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className="mt-1.5 w-full text-left text-xs text-muted-foreground hover:text-foreground"
            >
              출처 없이 삽입
            </button>
          </div>
        </>
      )}
    </>
  );
}
