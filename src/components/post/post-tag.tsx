import { RiCloseLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPostTagSizeClassName, type PostTagSize } from "./post-tag.styles";

type PostTagProps = {
  tag: string;
  size?: PostTagSize;
  onRemove?: () => void;
  className?: string;
};

export function PostTag({
  tag,
  size = "sm",
  onRemove,
  className,
}: PostTagProps): React.ReactElement {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "max-w-full min-w-0 text-[#305CEC] dark:text-[#5B7FFF]",
        getPostTagSizeClassName(size),
        onRemove && "gap-1",
        className,
      )}
    >
      <span className="min-w-0 truncate">{tag}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`${tag} 태그 삭제`}
        >
          <RiCloseLine size={14} />
        </button>
      ) : null}
    </Badge>
  );
}
