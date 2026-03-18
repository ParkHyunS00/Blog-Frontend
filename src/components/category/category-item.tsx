import { RiFolder4Fill, RiFolder4Line } from "@remixicon/react";

type CategoryItemProps = {
  name: string;
  count: number;
  variant?: "all" | "default";
  selected?: boolean;
  onClick?: () => void;
};

export function CategoryItem({
  name,
  count,
  variant = "default",
  selected = false,
  onClick,
}: CategoryItemProps): React.ReactElement {
  const FolderIcon = variant === "all" ? RiFolder4Fill : RiFolder4Line;
  const fontWeight = variant === "all" ? "font-bold" : "font-normal";
  const textColor = selected
    ? "text-[#305CEC] dark:text-[#5B7FFF]"
    : "text-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-3 px-2 py-1.5 text-left"
    >
      <FolderIcon size={18} className="shrink-0 text-foreground" />
      <span className={`text-sm ${fontWeight} ${textColor}`}>{name}</span>
      <span className="text-sm text-muted-foreground">({count})</span>
    </button>
  );
}
