import { Extension, Node } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    toggleBlock: {
      insertToggleBlock: () => ReturnType;
      unsetToggleBlock: () => ReturnType;
      exitToggleBlock: () => ReturnType;
    };
  }
}

export const ToggleSummary = Node.create({
  name: "toggleSummary",
  content: "inline*",
  defining: true,
  selectable: false,
  parseHTML: () => [{ tag: "summary" }],
  renderHTML: () => ["summary", {}, 0],
  addNodeView() {
    return () => {
      const dom = document.createElement("div");
      dom.className = "toggle-summary";
      dom.dataset.placeholder = "접기 제목을 입력하세요";
      return { dom, contentDOM: dom };
    };
  },
});

export const ToggleContent = Node.create({
  name: "toggleContent",
  content: "block+",
  defining: true,
  selectable: false,
  parseHTML: () => [{ tag: 'div[data-type="toggle-content"]' }],
  renderHTML: () => ["div", { "data-type": "toggle-content" }, 0],
});

// Only keyboard handling needs priority; block ordering must keep paragraph first.
const ToggleKeyboardShortcuts = Extension.create({
  name: "toggleKeyboardShortcuts",
  priority: 1100,
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        if (!this.editor.isActive("toggleSummary")) return false;
        return this.editor.commands.command(({ tr, state }) => {
          const { $from } = state.selection;
          const bodyStart = $from.after() + 1;
          tr.setSelection(TextSelection.near(tr.doc.resolve(bodyStart))).scrollIntoView();
          return true;
        });
      },
      "Mod-Enter": () => this.editor.commands.exitToggleBlock(),
      Backspace: () => {
        const { $from, empty } = this.editor.state.selection;
        if (!empty || $from.parent.type.name !== "toggleSummary" || $from.parent.content.size) return false;
        return this.editor.commands.unsetToggleBlock();
      },
    };
  },
});

export const ToggleBlock = Node.create({
  name: "toggleBlock",
  addExtensions() {
    return [ToggleKeyboardShortcuts];
  },
  group: "block",
  content: "toggleSummary toggleContent",
  defining: true,
  isolating: true,
  parseHTML: () => [{ tag: 'details[data-type="toggle"]' }],
  // Expansion while editing is local UI state. Published toggles start closed.
  renderHTML: () => ["details", { "data-type": "toggle" }, 0],
  addCommands() {
    return {
      insertToggleBlock: () => ({ state, tr, dispatch }) => {
        const { $from, $to } = state.selection;
        if ($from.parent.type.name === "toggleSummary") return false;
        const range = $from.blockRange($to);
        if (!range || !range.parent.canReplaceWith(range.startIndex, range.endIndex, this.type)) return false;
        if (dispatch) {
          const body = state.doc.slice(range.start, range.end).content;
          const block = this.type.create(null, [
            state.schema.nodes.toggleSummary.create(),
            state.schema.nodes.toggleContent.create(null, body),
          ]);
          tr.replaceWith(range.start, range.end, block);
          tr.setSelection(TextSelection.create(tr.doc, range.start + 2)).scrollIntoView();
        }
        return true;
      },
      unsetToggleBlock: () => ({ state, tr, dispatch }) => {
        const { $from } = state.selection;
        for (let depth = $from.depth; depth > 0; depth--) {
          const node = $from.node(depth);
          if (node.type !== this.type) continue;
          if (dispatch) {
            const title = node.firstChild!;
            const content = node.lastChild!;
            const blocks = title.content.size ? [state.schema.nodes.paragraph.create(null, title.content)] : [];
            content.forEach((child) => blocks.push(child));
            const start = $from.before(depth);
            tr.replaceWith(start, start + node.nodeSize, blocks);
            tr.setSelection(TextSelection.near(tr.doc.resolve(start + 1))).scrollIntoView();
          }
          return true;
        }
        return false;
      },
      exitToggleBlock: () => ({ state, tr, dispatch }) => {
        const { $from } = state.selection;
        for (let depth = $from.depth; depth > 0; depth--) {
          if ($from.node(depth).type !== this.type) continue;
          const after = $from.after(depth);
          if (dispatch) {
            if (!tr.doc.nodeAt(after)?.isTextblock) tr.insert(after, state.schema.nodes.paragraph.create());
            tr.setSelection(TextSelection.near(tr.doc.resolve(after + 1))).scrollIntoView();
          }
          return true;
        }
        return false;
      },
    };
  },
  addNodeView() {
    return ({ editor, getPos, node }) => {
      const dom = document.createElement("div");
      dom.className = "toggle-editor";
      dom.dataset.expanded = "true";
      const button = document.createElement("button");
      button.type = "button";
      button.contentEditable = "false";
      button.className = "toggle-disclosure";
      const contentDOM = document.createElement("div");
      contentDOM.className = "toggle-inner";
      dom.append(button, contentDOM);
      const setExpanded = (expanded: boolean) => {
        dom.dataset.expanded = String(expanded);
        button.setAttribute("aria-expanded", String(expanded));
        button.setAttribute("aria-label", expanded ? "접기 내용 접기" : "접기 내용 펼치기");
      };
      setExpanded(true);
      button.addEventListener("mousedown", (event) => event.preventDefault());
      button.addEventListener("click", () => {
        const pos = getPos();
        if (typeof pos !== "number") return;
        const expanded = dom.dataset.expanded === "true";
        editor.chain().focus().setTextSelection(pos + 2).run();
        setExpanded(!expanded);
      });
      const revealSelection = () => {
        const pos = getPos();
        if (typeof pos !== "number") return;
        const current = editor.state.doc.nodeAt(pos);
        const from = editor.state.selection.from;
        if (current && from > pos + 1 + current.firstChild!.nodeSize && from < pos + current.nodeSize) setExpanded(true);
      };
      editor.on("selectionUpdate", revealSelection);
      return {
        dom, contentDOM,
        update: (next) => next.type === node.type,
        stopEvent: (event) => button.contains(event.target as globalThis.Node),
        ignoreMutation: (mutation) => mutation.type !== "selection" && (mutation.target === dom || button.contains(mutation.target)),
        destroy: () => editor.off("selectionUpdate", revealSelection),
      };
    };
  },
});
