import type { EditorState } from "@tiptap/pm/state";
import { TableMap } from "@tiptap/pm/tables";
import type { Editor } from "@tiptap/react";

export function findSelectedTable(state: EditorState) {
  const { $from } = state.selection;
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === "table") return { node, pos: $from.before(depth) };
  }
  return null;
}

export function getTableState(state: EditorState) {
  const table = findSelectedTable(state);
  if (!table) return { active: false, rows: 0, columns: 0, header: false };
  let header = true;
  table.node.firstChild?.forEach((cell) => { header &&= cell.type.name === "tableHeader"; });
  return { active: true, rows: table.node.childCount, columns: TableMap.get(table.node).width, header };
}

export function exitTable(editor: Editor): boolean {
  const table = findSelectedTable(editor.state);
  if (!table) return false;
  const after = table.pos + table.node.nodeSize;
  const next = editor.state.doc.nodeAt(after);
  const chain = editor.chain().focus();
  if (!next?.isTextblock) chain.insertContentAt(after, { type: "paragraph" });
  return chain.setTextSelection(after + 1).run();
}
