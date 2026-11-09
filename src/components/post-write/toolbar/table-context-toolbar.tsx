import { type Editor, useEditorState } from "@tiptap/react";
import { ArrowDownToLine, Columns3, Rows3 } from "lucide-react";
import { getTableState, exitTable } from "@/components/post-write/table-state";
import { TableDropdown } from "@/components/post-write/toolbar/table-dropdown";

const buttonClass = "flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground";

export function TableContextToolbar({ editor }: { editor: Editor }): React.ReactElement | null {
  const table = useEditorState({ editor, selector: ({ editor: e }) => getTableState(e.state) });
  if (!table.active) return null;
  return (
    <div role="group" aria-label="표 빠른 편집" className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/25 px-3 py-1.5">
      <span className="mr-2 text-xs text-muted-foreground">{table.rows}행 × {table.columns}열</span>
      <button type="button" className={buttonClass} onClick={() => editor.chain().focus().addRowAfter().run()}><Rows3 size={14} />행 추가</button>
      <button type="button" className={buttonClass} onClick={() => editor.chain().focus().addColumnAfter().run()}><Columns3 size={14} />열 추가</button>
      <TableDropdown editor={editor} contextual />
      <button type="button" className={buttonClass} onClick={() => exitTable(editor)}><ArrowDownToLine size={14} />표 아래에 쓰기</button>
      <span className="ml-auto hidden text-[11px] text-muted-foreground lg:inline">Tab 다음 셀 · Shift+Tab 이전 셀</span>
    </div>
  );
}
