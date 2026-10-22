import assert from "node:assert/strict";
import test from "node:test";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Callout } from "./callout.ts";
import { ClearMarksOnEnter } from "./clear-marks-on-enter.ts";

for (const text of ["", "콜아웃 내용"]) {
  test(`콜아웃 Enter는 내용을 보존하고 아래 일반 문단으로 이동한다 (${text || "빈 내용"})`, () => {
    const editor = new Editor({
      element: null,
      extensions: [StarterKit, Callout, ClearMarksOnEnter],
      content: { type: "doc", content: [
        { type: "callout", content: [{ type: "paragraph", ...(text ? {content: [{type: "text", text}]} : {}) }] },
        { type: "paragraph", content: [{ type: "text", text: "다음 문단" }] },
      ] },
    });
    try {
      editor.commands.setTextSelection(2 + text.length);
      editor.commands.setMark("bold");
      const before = editor.state.doc.firstChild?.toJSON();
      const shortcut = ClearMarksOnEnter.config.addKeyboardShortcuts!.call({ editor } as never).Enter;
      assert.equal(shortcut({ editor }), true);
      assert.deepEqual(editor.state.doc.firstChild?.toJSON(), before);
      assert.equal(editor.state.doc.childCount, 3);
      assert.equal(editor.state.doc.child(1).type.name, "paragraph");
      assert.equal(editor.state.doc.child(1).textContent, "");
      assert.equal(editor.state.doc.lastChild?.textContent, "다음 문단");
      assert.equal(editor.state.selection.$from.depth, 1);
      assert.deepEqual(editor.state.storedMarks, []);
    } finally { editor.destroy(); }
  });
}
