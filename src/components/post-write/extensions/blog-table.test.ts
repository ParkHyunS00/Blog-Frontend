import assert from "node:assert/strict";
import test from "node:test";
import { DOMParser as HtmlParser, parseHTML } from "linkedom";
import { Editor, getSchema } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableRow } from "@tiptap/extension-table";
import { DOMParser, DOMSerializer } from "@tiptap/pm/model";
import { CellSelection } from "@tiptap/pm/tables";
import { BlogTable, BlogTableCell, BlogTableHeader } from "./blog-table.ts";
import { getTableState } from "../table-state.ts";
import { wrapPostTables } from "../../../features/post/lib/wrap-post-tables.ts";

const { window, document } = parseHTML("<!doctype html><html><body></body></html>");
Object.defineProperty(globalThis, "window", { configurable: true, value: window });
Object.defineProperty(globalThis, "document", { configurable: true, value: document });
Object.defineProperty(globalThis, "DOMParser", { configurable: true, value: HtmlParser });
const extensions = [StarterKit, BlogTable, TableRow, BlogTableCell, BlogTableHeader];
const schema = getSchema(extensions);
function parse(html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;
  return DOMParser.fromSchema(schema).parse(container);
}
function serialize(doc: ReturnType<typeof parse>) {
  const container = document.createElement("div");
  container.appendChild(DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document }));
  return container.innerHTML;
}
const source = '<table><tbody><tr><th><p>항목</p></th><th><p>설명</p></th></tr><tr><td><p>내용</p></td><td><p>본문</p></td></tr></tbody></table>';
function createEditor() { return new Editor({ element: null, extensions, content: parse(source).toJSON() }); }
function textPosition(editor: Editor, text: string) {
  let position = 0;
  editor.state.doc.descendants((node, pos) => { if (node.isText && node.text === text) position = pos; });
  return position;
}

test("아래쪽 셀에서 헤더를 전환해도 첫 행만 변경하고 본문을 유지한다", () => {
  const editor = createEditor();
  try {
    editor.commands.setTextSelection(textPosition(editor, "본문"));
    assert.deepEqual(getTableState(editor.state), { active: true, rows: 2, columns: 2, header: true });
    assert.equal(editor.commands.toggleHeaderRow(), true);
    assert.equal(getTableState(editor.state).header, false);
    assert.equal(editor.state.doc.firstChild?.firstChild?.firstChild?.type.name, "tableCell");
    assert.equal(editor.state.doc.firstChild?.lastChild?.firstChild?.type.name, "tableCell");
    editor.commands.toggleHeaderRow();
    assert.equal(editor.state.doc.textContent, "항목설명내용본문");
    assert.equal(getTableState(editor.state).header, true);
    assert.deepEqual(parse(serialize(editor.state.doc)).toJSON(), editor.getJSON());
  } finally { editor.destroy(); }
});

test("셀 정렬은 백엔드가 허용하는 align 속성으로 저장하고 다시 읽는다", () => {
  const editor = createEditor();
  try {
    editor.commands.setTextSelection(textPosition(editor, "본문"));
    editor.commands.setCellAttribute("align", "right");
    const html = serialize(editor.state.doc);
    assert.match(html, /<td[^>]*align="right"/);
    assert.doesNotMatch(html, /text-align/);
    assert.equal(parse(html).firstChild?.lastChild?.lastChild?.attrs.align, "right");
    assert.equal(parse('<table><tr><td align="invalid"><p>본문</p></td></tr></table>').firstChild?.firstChild?.firstChild?.attrs.align, null);
  } finally { editor.destroy(); }
});

test("선택한 셀을 병합·분리해도 본문을 유지하고 병합 정보를 저장한다", () => {
  const editor = createEditor();
  try {
    const cells: number[] = [];
    editor.state.doc.descendants((node, pos) => { if (node.type.name === "tableCell") cells.push(pos); });
    editor.commands.command(({ tr }) => { tr.setSelection(CellSelection.create(tr.doc, cells[0], cells[1])); return true; });
    assert.equal(editor.commands.mergeCells(), true);
    assert.match(serialize(editor.state.doc), /colspan="2"/);
    assert.equal(editor.commands.splitCell(), true);
    assert.equal(editor.state.doc.textContent, "항목설명내용본문");
  } finally { editor.destroy(); }
});

test("헤더 없는 표를 삽입하고 행·열을 추가할 수 있다", () => {
  const editor = new Editor({ element: null, extensions, content: { type: "doc", content: [{ type: "paragraph" }] } });
  try {
    editor.commands.insertTable({ rows: 3, cols: 4, withHeaderRow: false });
    assert.deepEqual(getTableState(editor.state), { active: true, rows: 3, columns: 4, header: false });
    editor.commands.addRowAfter();
    editor.commands.addColumnBefore();
    assert.deepEqual(getTableState(editor.state), { active: true, rows: 4, columns: 5, header: false });
  } finally { editor.destroy(); }
});

test("기존 표와 새 표에 스크롤 영역을 한 번만 적용하고 헤더·정렬을 보존한다", () => {
  const html = source.replace('<td>', '<td align="center">');
  const result = wrapPostTables(html);
  assert.match(result, /class="tableWrapper"/);
  assert.match(result, /tabindex="0"/);
  assert.equal(wrapPostTables(result), result);
  assert.deepEqual(parse(result).toJSON(), parse(html).toJSON());
  assert.equal(wrapPostTables('<p>본문</p>'), '<p>본문</p>');
});

test("균등 분배 옵션은 저장·재편집 후에도 유지하고 기본값으로 되돌릴 수 있다", () => {
  const editor = createEditor();
  try {
    editor.commands.setTextSelection(textPosition(editor, "본문"));
    editor.commands.updateAttributes("table", { layout: "equal" });
    const html = serialize(editor.state.doc);
    assert.match(html, /data-table-layout="equal"/);
    assert.equal(parse(html).firstChild?.attrs.layout, "equal");
    // Server intentionally strips inline style, but preserves the allowed layout attribute.
    const saved = html.replace(/ style="[^"]*"/g, "");
    const detail = wrapPostTables(saved);
    assert.match(detail, /min-width:\s*256px/);
    assert.equal(parse(detail).firstChild?.attrs.layout, "equal");
    editor.commands.updateAttributes("table", { layout: "auto" });
    assert.doesNotMatch(serialize(editor.state.doc), /data-table-layout/);
    assert.equal(parse(serialize(editor.state.doc)).firstChild?.attrs.layout, "auto");
  } finally { editor.destroy(); }
});

test("병합된 헤더에서도 열 수만큼 균등 열과 최소 너비를 유지한다", () => {
  const doc = parse('<table data-table-layout="equal"><tr><th colspan="3"><p>제목</p></th></tr><tr><td><p>A</p></td><td><p>B</p></td><td><p>C</p></td></tr></table>');
  const html = serialize(doc);
  assert.equal((html.match(/<col>/g) ?? []).length, 3);
  assert.match(wrapPostTables(html), /min-width:\s*384px/);
  assert.equal(parse(html).firstChild?.firstChild?.firstChild?.attrs.colspan, 3);
});

test("속성이 없거나 허용되지 않은 표 레이아웃은 내용에 맞춤을 사용한다", () => {
  assert.equal(parse(source).firstChild?.attrs.layout, "auto");
  assert.equal(parse(source.replace('<table>', '<table data-table-layout="invalid">')).firstChild?.attrs.layout, "auto");
});

for (const theme of ["default", "striped", "minimal"]) {
  for (const layout of ["auto", "equal"]) {
    test(`${theme}/${layout}: 테마는 헤더·정렬·열 너비와 함께 저장하고 다시 읽는다`, () => {
      const editor = createEditor();
      try {
        editor.commands.setTextSelection(textPosition(editor, "본문"));
        editor.commands.setCellAttribute("align", "right");
        editor.commands.updateAttributes("table", { theme, layout });
        const html = serialize(editor.state.doc);
        assert.equal(html.includes("data-table-theme"), theme !== "default");
        const restored = parse(wrapPostTables(html));
        assert.deepEqual(restored.toJSON(), editor.getJSON());
        assert.equal(restored.firstChild?.attrs.theme, theme);
        assert.equal(restored.firstChild?.attrs.layout, layout);
        assert.equal(restored.firstChild?.lastChild?.lastChild?.attrs.align, "right");
        editor.commands.toggleHeaderRow();
        assert.equal(editor.state.doc.firstChild?.attrs.theme, theme);
        editor.commands.updateAttributes("table", { theme: "default" });
        assert.doesNotMatch(serialize(editor.state.doc), /data-table-theme/);
        assert.equal(getTableState(editor.state).header, false);
      } finally { editor.destroy(); }
    });
  }
}

test("누락·잘못된 테마는 기본으로 처리하고 프론트에서 테마를 추측하지 않는다", () => {
  for (const attrs of ["", ' data-table-theme="invalid"']) {
    const parsed = parse(source.replace("<table>", `<table${attrs}>`));
    assert.equal(parsed.firstChild?.attrs.theme, "default");
    assert.doesNotMatch(serialize(parsed), /data-table-theme/);
  }
});
