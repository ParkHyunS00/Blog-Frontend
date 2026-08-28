import { useState, useRef } from "react";
import { RiAddLine } from "@remixicon/react";
import { PostTag } from "@/components/post/post-tag";
import { POST_TAG_MAX_LENGTH } from "@/features/post/lib/post-write-constraints";
import { cn } from "@/lib/utils";
import { getAvailableTagSuggestions } from "./tag-input-options";

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  maxTags?: number;
};

const MAX_TAGS_DEFAULT = 5;

export function TagInput({ value, onChange, suggestions, maxTags = MAX_TAGS_DEFAULT }: Props): React.ReactElement {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const isComposingRef = useRef(false);

  const isMaxReached = value.length >= maxTags;
  // js-set-map-lookups: Set으로 O(1) 조회
  const valueSet = new Set(value);
  const filteredSuggestions = getAvailableTagSuggestions(suggestions, value, inputValue);
  const trimmedInput = inputValue.trim();
  const showNewTagOption = trimmedInput && !filteredSuggestions.includes(trimmedInput) && !valueSet.has(trimmedInput);

  function addTag(tag: string): void {
    const trimmed = tag.trim().slice(0, POST_TAG_MAX_LENGTH);
    if (!trimmed || valueSet.has(trimmed) || isMaxReached) return;
    onChange([...value, trimmed]);
    setInputValue("");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setInputValue(e.target.value.slice(0, POST_TAG_MAX_LENGTH));
  }

  function removeTag(tag: string): void {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (isComposingRef.current) return;

    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
    if (e.key === "Escape") {
      setIsFocused(false);
    }
  }

  return (
    <div className="min-w-0 space-y-2">
      {/* 태그 입력 필드 */}
      <div className="relative min-w-0">
        <div
          className={cn(
            "flex h-10 min-w-0 items-center gap-2 rounded-lg border border-border bg-background px-3 transition-colors",
            isFocused && "border-ring",
            isMaxReached && "opacity-60"
          )}
        >
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            maxLength={POST_TAG_MAX_LENGTH}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => { isComposingRef.current = true; }}
            onCompositionEnd={() => { isComposingRef.current = false; }}
            disabled={isMaxReached}
            placeholder={isMaxReached ? "최대 태그 수에 도달했습니다" : "태그 입력 후 Enter"}
            className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
          <span className="flex-shrink-0 text-xs text-muted-foreground">
            {value.length}/{maxTags}
          </span>
        </div>

        {/* 드롭다운 */}
        {isFocused && !isMaxReached ? (
          <div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-background shadow-lg">
            {filteredSuggestions.length > 0 ? (
              <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto p-3">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addTag(suggestion)}
                    className="min-w-0 rounded-full transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`${suggestion} 태그 선택`}
                  >
                    <PostTag tag={suggestion} />
                  </button>
                ))}
              </div>
            ) : !showNewTagOption ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">선택할 수 있는 태그가 없습니다.</p>
            ) : null}
            {showNewTagOption ? (
              <div className={cn(filteredSuggestions.length > 0 && "border-t border-border")}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => addTag(inputValue)}
                  className="flex w-full min-w-0 items-center gap-2 px-4 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <RiAddLine size={14} className="shrink-0" />
                  <span className="min-w-0 truncate">&quot;{inputValue.trim()}&quot; 태그 추가</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* rendering-conditional-render: 삼항 연산자 사용 */}
      {value.length > 0 ? (
        <div className="flex min-w-0 flex-wrap gap-2">
          {value.map((tag) => (
            <PostTag
              key={tag}
              tag={tag}
              onRemove={() => removeTag(tag)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
