import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { common, createLowlight } from "lowlight";
import { Callout } from "@/components/post-write/extensions/callout";
import { ImageWithCaption } from "@/components/post-write/extensions/image-with-caption";
import { EditorToolbar } from "@/components/post-write/editor-toolbar";
import { ClearMarksOnEnter } from "@/components/post-write/extensions/clear-marks-on-enter";
import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);

type Props = {
  content: string;
  onChange: (html: string) => void;
  className?: string;
};

export function PostEditor({ content, onChange, className }: Props): React.ReactElement {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        link: false,
        underline: false,
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({ placeholder: "본문을 작성하세요..." }),
      Callout,
      ImageWithCaption,
      ClearMarksOnEnter,
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: "post-content post-editor-content outline-none",
      },
      handleKeyDown: (_view, event) => {
        if (!editor) return false;

        // Tab: 4칸 공백 삽입
        if (event.key === "Tab" && !event.shiftKey) {
          event.preventDefault();
          editor.chain().focus().insertContent("\u00A0\u00A0\u00A0\u00A0").run();
          return true;
        }

        // Backspace: 빈 리스트 항목에서 리스트 해제 → 일반 텍스트 전환
        if (event.key === "Backspace") {
          const { from, empty } = editor.state.selection;
          if (!empty) return false;

          const isInList = editor.isActive("bulletList") || editor.isActive("orderedList");
          if (!isInList) return false;

          const $from = editor.state.doc.resolve(from);
          if ($from.parentOffset === 0) {
            editor.chain().liftListItem("listItem").run();
            return true;
          }
        }

        return false;
      },
    },
  });

  if (!editor) return <div />;

  return (
    <div className={cn("flex flex-col rounded-lg border border-border bg-background transition-colors focus-within:border-ring", className)}>
      <div className="relative z-10">
        <EditorToolbar editor={editor} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto rounded-b-lg px-2 py-4 sm:px-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
