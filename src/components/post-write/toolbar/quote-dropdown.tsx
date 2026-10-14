import { type Editor, useEditorState } from "@tiptap/react";
import { RiDoubleQuotesL, RiArrowDownSLine } from "@remixicon/react";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { QUOTE_STYLES, normalizeQuoteStyle, type QuoteStyle } from "@/features/post/lib/quote-style";
import { ACTIVE_CLASS } from "@/components/post-write/toolbar/toolbar-primitives";
import { cn } from "@/lib/utils";

export function QuoteDropdown({ editor }: { editor: Editor }): React.ReactElement {
  const { active, style } = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      active: e.isActive("blockquote"),
      style: normalizeQuoteStyle(e.getAttributes("blockquote").quoteStyle),
    }),
  });

  function selectStyle(quoteStyle: QuoteStyle): void {
    const chain = editor.chain().focus();
    if (editor.isActive("blockquote")) {
      chain.updateAttributes("blockquote", { quoteStyle }).run();
    } else {
      chain.wrapIn("blockquote", { quoteStyle }).run();
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" title="인용 스타일" aria-label="인용 스타일"
          className={cn("flex h-8 items-center gap-0.5 rounded-md px-2 text-muted-foreground hover:bg-secondary hover:text-foreground", active && ACTIVE_CLASS)}>
          <RiDoubleQuotesL size={18} />
          {active && style !== "default" && <span className="text-xs">{QUOTE_STYLES.find((item) => item.value === style)?.label}</span>}
          <RiArrowDownSLine size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64" onCloseAutoFocus={(event) => event.preventDefault()}>
        <DropdownMenuRadioGroup value={active ? style : ""}>
          {QUOTE_STYLES.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value} indicatorPosition="right" className="py-2 text-left" onSelect={() => selectStyle(item.value)}>
              <span className="quote-option flex w-full items-center gap-3" data-quote-style={item.value}>
                <span className="flex size-5 shrink-0 items-center justify-center">
                  {item.value === "default" ? <RiDoubleQuotesL className="size-[18px]" /> : <span className="quote-icon" aria-hidden="true" />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                  <span className="quote-option-label font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={!active} onSelect={() => editor.chain().focus().unsetBlockquote().run()}>
          인용 해제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
