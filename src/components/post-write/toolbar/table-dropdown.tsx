import { useId, useRef, useState } from "react";
import { type Editor, useEditorState } from "@tiptap/react";
import { Popover } from "radix-ui";
import {
  Table2, Plus, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Rows3, Columns3, Trash2, Merge, Split, AlignLeft, AlignCenter, AlignRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ACTIVE_CLASS } from "@/components/post-write/toolbar/toolbar-primitives";
import { getTableState } from "@/components/post-write/table-state";
import { normalizeTableLayout, type TableLayout } from "@/features/post/lib/table-layout";
import { normalizeTableTheme, type TableTheme } from "@/features/post/lib/table-theme";
import { TableThemePicker } from "@/components/post-write/toolbar/table-theme-picker";

const GRID_ROWS = 5;
const GRID_COLUMNS = 6;
const actionClass = "flex min-h-9 items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-35";

type Props = { editor: Editor; contextual?: boolean };

export function TableDropdown({ editor, contextual = false }: Props): React.ReactElement {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [header, setHeader] = useState(true);
  const [layout, setLayout] = useState<TableLayout>("auto");
  const [theme, setTheme] = useState<TableTheme>("default");
  const [gridIndex, setGridIndex] = useState(0);
  const gridRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const table = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      ...getTableState(e.state),
      canMerge: e.can().mergeCells(),
      canSplit: e.can().splitCell(),
      align: e.getAttributes(e.isActive("tableHeader") ? "tableHeader" : "tableCell").align ?? "left",
      layout: normalizeTableLayout(e.getAttributes("table").layout),
      theme: normalizeTableTheme(e.getAttributes("table").theme),
    }),
  });

  function run(action: () => unknown): void {
    action();
    setOpen(false);
  }

  function insert(rowCount = rows, columnCount = columns): void {
    run(() => editor.chain().focus()
      .insertTable({ rows: rowCount, cols: columnCount, withHeaderRow: header })
      .updateAttributes("table", { layout, theme }).run());
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" title={table.active ? "표 옵션" : "표 삽입"} aria-label={table.active ? "표 옵션" : "표 삽입"}
          className={cn("flex h-8 items-center justify-center gap-1.5 rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground", contextual ? "px-2 text-xs font-medium" : "w-8", table.active && ACTIVE_CLASS)}>
          <Table2 size={17} />{contextual && "표 옵션"}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content aria-labelledby={titleId} align="start" sideOffset={8} collisionPadding={12}
          onCloseAutoFocus={(event) => event.preventDefault()}
          className="z-50 w-72 max-w-[calc(100vw-24px)] max-h-[min(640px,var(--radix-popover-content-available-height))] overflow-y-auto rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-xl">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 id={titleId} className="text-sm font-semibold">{table.active ? "표 옵션" : "표 만들기"}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{table.active ? `${table.rows}행 × ${table.columns}열 · 현재 셀 기준으로 편집` : "필요한 크기를 선택하세요"}</p>
            </div>
            <Popover.Close aria-label="표 옵션 닫기" className="rounded p-1 text-muted-foreground hover:bg-secondary"><X size={16} /></Popover.Close>
          </div>

          <TableThemePicker name={`${titleId}-table-theme`} value={table.active ? table.theme : theme}
            withHeader={table.active ? table.header : header}
            onChange={(value) => {
              if (table.active) editor.commands.updateAttributes("table", { theme: value });
              else setTheme(value);
            }} />

          <label className="mb-3 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
            <span><span className="block text-xs font-medium">첫 행을 헤더로 표시</span><span className="mt-0.5 block text-xs text-muted-foreground">열 제목에 배경색과 강조 적용</span></span>
            <input type="checkbox" className="size-4 shrink-0 accent-[#305CEC]" checked={table.active ? table.header : header}
              onChange={(event) => {
                if (table.active) editor.commands.toggleHeaderRow();
                else setHeader(event.target.checked);
              }} />
          </label>

          <fieldset className="mb-4">
            <legend className="mb-2 text-xs font-medium text-muted-foreground">열 너비</legend>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted/40 p-1">
              {([{ value: "auto", label: "내용에 맞춤" }, { value: "equal", label: "균등 분배" }] as const).map((option) => (
                <label key={option.value} className={cn("cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium transition-colors has-focus-visible:outline-2 has-focus-visible:outline-ring", (table.active ? table.layout : layout) === option.value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-secondary")}>
                  <input type="radio" className="sr-only" name={`${titleId}-table-layout`} value={option.value}
                    checked={(table.active ? table.layout : layout) === option.value}
                    onChange={() => {
                      if (table.active) editor.commands.updateAttributes("table", { layout: option.value });
                      else setLayout(option.value);
                    }} />
                  {option.label}
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">{(table.active ? table.layout : layout) === "equal" ? "모든 열을 같은 너비로 표시합니다." : "내용에 따라 열 너비를 자동으로 조절합니다."}</p>
          </fieldset>

          {!table.active ? (
            <>
              <div className="grid grid-cols-6 gap-1" role="group" aria-label="표 크기 선택">
                {Array.from({ length: GRID_ROWS * GRID_COLUMNS }, (_, index) => {
                  const row = Math.floor(index / GRID_COLUMNS) + 1;
                  const column = index % GRID_COLUMNS + 1;
                  return <button key={index} ref={(element) => { gridRefs.current[index] = element; }} type="button"
                    aria-label={`${row}행 ${column}열 표 삽입`} tabIndex={index === gridIndex ? 0 : -1}
                    className={cn("h-8 rounded-sm border transition-colors focus-visible:outline-2 focus-visible:outline-ring", row <= rows && column <= columns ? "border-[#305CEC]/40 bg-[#305CEC]/15 dark:border-[#5B7FFF]/50 dark:bg-[#5B7FFF]/20" : "border-border bg-muted/30")}
                    onMouseEnter={() => { setRows(row); setColumns(column); }}
                    onFocus={() => { setGridIndex(index); setRows(row); setColumns(column); }}
                    onKeyDown={(event) => {
                      const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: GRID_COLUMNS, ArrowUp: -GRID_COLUMNS };
                      if (!(event.key in offsets)) return;
                      event.preventDefault();
                      const next = Math.max(0, Math.min(GRID_ROWS * GRID_COLUMNS - 1, index + offsets[event.key]));
                      gridRefs.current[next]?.focus();
                    }}
                    onClick={() => insert(row, column)} />;
                })}
              </div>
              <p className="my-2 text-center text-xs text-muted-foreground" aria-live="polite">{rows}행 × {columns}열</p>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <label className="text-xs text-muted-foreground">행 (1–20)
                  <input aria-label="표 행 수" type="number" min={1} max={20} value={rows} onChange={(event) => setRows(Math.max(1, Math.min(20, Number(event.target.value) || 1)))} className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" />
                </label>
                <label className="text-xs text-muted-foreground">열 (1–10)
                  <input aria-label="표 열 수" type="number" min={1} max={10} value={columns} onChange={(event) => setColumns(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} className="mt-1 h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground" />
                </label>
              </div>
              <button type="button" onClick={() => insert()} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"><Plus size={16} />표 삽입</button>
            </>
          ) : (
            <>
              <p className="mb-1 text-xs font-medium text-muted-foreground">행과 열</p>
              <div className="grid grid-cols-2 gap-1">
                <button type="button" className={actionClass} onClick={() => run(() => editor.chain().focus().addRowBefore().run())}><ArrowUp size={15} />위에 행 추가</button>
                <button type="button" className={actionClass} onClick={() => run(() => editor.chain().focus().addRowAfter().run())}><ArrowDown size={15} />아래에 행 추가</button>
                <button type="button" className={actionClass} onClick={() => run(() => editor.chain().focus().addColumnBefore().run())}><ArrowLeft size={15} />왼쪽에 열 추가</button>
                <button type="button" className={actionClass} onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}><ArrowRight size={15} />오른쪽에 열 추가</button>
              </div>
              <div className="my-3 border-t border-border" />
              <p className="mb-2 text-xs font-medium text-muted-foreground">선택한 셀 정렬</p>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted/40 p-1">
                {([{ value: "left", label: "왼쪽 정렬", Icon: AlignLeft }, { value: "center", label: "가운데 정렬", Icon: AlignCenter }, { value: "right", label: "오른쪽 정렬", Icon: AlignRight }] as const).map(({ value, label, Icon }) => (
                  <button type="button" key={value} aria-label={label} title={label} aria-pressed={table.align === value}
                    className={cn("flex h-8 items-center justify-center rounded-md hover:bg-secondary", table.align === value && "bg-background text-primary shadow-sm")}
                    onClick={() => editor.commands.setCellAttribute("align", value)}><Icon size={17} /></button>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1">
                <button type="button" className={actionClass} disabled={!table.canMerge} onClick={() => run(() => editor.chain().focus().mergeCells().run())}><Merge size={15} />셀 병합</button>
                <button type="button" className={actionClass} disabled={!table.canSplit} onClick={() => run(() => editor.chain().focus().splitCell().run())}><Split size={15} />셀 분리</button>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">여러 셀을 드래그해 선택하면 병합할 수 있어요.</p>
              <div className="my-3 border-t border-border" />
              <div className="grid grid-cols-2 gap-1">
                <button type="button" className={cn(actionClass, "text-destructive")} onClick={() => run(() => editor.chain().focus().deleteRow().run())}><Rows3 size={15} />행 삭제</button>
                <button type="button" className={cn(actionClass, "text-destructive")} onClick={() => run(() => editor.chain().focus().deleteColumn().run())}><Columns3 size={15} />열 삭제</button>
              </div>
              <button type="button" className={cn(actionClass, "mt-1 w-full text-destructive hover:bg-destructive/10")} onClick={() => run(() => editor.chain().focus().deleteTable().run())}><Trash2 size={15} />표 전체 삭제</button>
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
