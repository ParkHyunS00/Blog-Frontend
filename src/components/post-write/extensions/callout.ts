import { Node, mergeAttributes } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attrs?: { emoji?: string }) => ReturnType;
      toggleCallout: (attrs?: { emoji?: string }) => ReturnType;
      unsetCallout: () => ReturnType;
      exitCallout: () => ReturnType;
    };
  }
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",

  addAttributes() {
    return {
      emoji: {
        default: "💡",
        parseHTML: (element) => {
          const emojiEl = element.querySelector(".callout-emoji");
          return emojiEl?.textContent?.trim() ?? "💡";
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "callout" }),
      ["span", { class: "callout-emoji", contenteditable: "false" }, HTMLAttributes.emoji ?? "💡"],
      ["div", { class: "callout-content" }, 0],
    ];
  },

  addCommands() {
    return {
      exitCallout: () => ({ state, tr, dispatch }) => {
        const { $from } = state.selection;
        for (let depth = $from.depth; depth > 0; depth--) {
          if ($from.node(depth).type !== this.type) continue;
          const after = $from.after(depth);
          const $after = state.doc.resolve(after);
          const paragraph = state.schema.nodes.paragraph;
          if (!$after.parent.canReplaceWith($after.index(), $after.index(), paragraph)) return false;
          if (dispatch) {
            tr.insert(after, paragraph.create());
            tr.setSelection(TextSelection.create(tr.doc, after + 1));
            tr.setStoredMarks([]).scrollIntoView();
          }
          return true;
        }
        return false;
      },
      setCallout:
        (attrs) =>
        ({ commands }) =>
          commands.wrapIn(this.name, attrs),
      toggleCallout:
        (attrs) =>
        ({ commands }) =>
          commands.toggleWrap(this.name, attrs),
      unsetCallout:
        () =>
        ({ commands }) =>
          commands.lift(this.name),
    };
  },
});
