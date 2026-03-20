import { cn } from "@/lib/utils";

export const ACTIVE_CLASS = "bg-[#305CEC]/10 text-[#305CEC] dark:bg-[#5B7FFF]/10 dark:text-[#5B7FFF]";

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

export function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        "text-muted-foreground hover:bg-secondary hover:text-foreground",
        "disabled:pointer-events-none disabled:opacity-40",
        isActive && ACTIVE_CLASS,
      )}
    >
      {children}
    </button>
  );
}

export function ToolbarDivider(): React.ReactElement {
  return <div className="mx-1 h-5 w-px bg-border" />;
}
