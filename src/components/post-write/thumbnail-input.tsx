import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  THUMBNAIL_ACCEPT,
  THUMBNAIL_ACCEPTED_TYPES,
  THUMBNAIL_TARGET_HEIGHT,
  THUMBNAIL_TARGET_WIDTH,
} from "@/features/post/lib/post-write-constraints";

type ThumbnailValue = {
  file: File | null;
  previewUrl: string;
};

type Props = {
  value: ThumbnailValue;
  onChange: (value: ThumbnailValue) => void;
};

export function ThumbnailInput({ value, onChange }: Props): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function handleClick(): void {
    inputRef.current?.click();
  }

  function handleRemove(): void {
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onChange({ file: null, previewUrl: "" });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!THUMBNAIL_ACCEPTED_TYPES.includes(file.type as (typeof THUMBNAIL_ACCEPTED_TYPES)[number])) {
      setError("JPG, PNG, WebP 이미지만 등록할 수 있습니다.");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      setError("");
      onChange({ file, previewUrl });
    };

    image.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      setError("이미지를 불러올 수 없습니다. 다른 파일을 선택하세요.");
      e.target.value = "";
    };

    image.src = previewUrl;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-muted-foreground">썸네일</label>
        {value.previewUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
            삭제
          </Button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="group relative flex aspect-[23/16] w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-secondary/40 text-left transition-colors hover:border-ring hover:bg-secondary focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {value.previewUrl ? (
          <img
            src={value.previewUrl}
            alt="선택한 썸네일 미리보기"
            className="size-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
            <ImagePlus className="size-6" />
            썸네일 이미지 선택
          </span>
        )}
      </button>

      <input ref={inputRef} type="file" accept={THUMBNAIL_ACCEPT} onChange={handleFileChange} className="sr-only" />

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          저장 시 목록 비율({THUMBNAIL_TARGET_WIDTH}x{THUMBNAIL_TARGET_HEIGHT})에 맞춰 리사이즈 후 중앙 기준으로 잘라내는 방식이 적합합니다.
        </p>
        {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
