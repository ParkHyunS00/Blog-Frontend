import { type Editor, useEditorState } from "@tiptap/react";
import {
  RiBold,
  RiItalic,
  RiUnderline,
  RiStrikethrough,
  RiListUnordered,
  RiListOrdered,
  RiDoubleQuotesL,
  RiCodeLine,
  RiSeparator,
  RiAlertLine,
} from "@remixicon/react";
import { ToolbarButton, ToolbarDivider } from "@/components/post-write/toolbar/toolbar-primitives";
import { HeadingDropdown } from "@/components/post-write/toolbar/heading-dropdown";
import { HighlightDropdown } from "@/components/post-write/toolbar/highlight-dropdown";
import { CodeBlockDropdown } from "@/components/post-write/toolbar/code-block-dropdown";
import { TableDropdown } from "@/components/post-write/toolbar/table-dropdown";
import { LinkButton } from "@/components/post-write/toolbar/link-button";
import { ImageButton } from "@/components/post-write/toolbar/image-button";

type Props = {
  editor: Editor;
};

export function EditorToolbar({ editor }: Props): React.ReactElement {
  const activeStates = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      callout: e.isActive("callout"),
    }),
  });

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-3 py-2">
      <HeadingDropdown editor={editor} />

      <ToolbarDivider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={activeStates.bold} title="굵게 (Ctrl+B)">
        <RiBold size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={activeStates.italic} title="기울임 (Ctrl+I)">
        <RiItalic size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={activeStates.underline} title="밑줄 (Ctrl+U)">
        <RiUnderline size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={activeStates.strike} title="취소선">
        <RiStrikethrough size={18} />
      </ToolbarButton>

      <ToolbarDivider />

      <HighlightDropdown editor={editor} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={activeStates.code} title="인라인 코드">
        <RiCodeLine size={18} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={activeStates.bulletList} title="순서 없는 목록">
        <RiListUnordered size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={activeStates.orderedList} title="순서 있는 목록">
        <RiListOrdered size={18} />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={activeStates.blockquote} title="인용">
        <RiDoubleQuotesL size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCallout().run()} isActive={activeStates.callout} title="콜아웃">
        <RiAlertLine size={18} />
      </ToolbarButton>
      <CodeBlockDropdown editor={editor} />

      <ToolbarDivider />

      <LinkButton editor={editor} />
      <ImageButton editor={editor} />
      <TableDropdown editor={editor} />
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="구분선">
        <RiSeparator size={18} />
      </ToolbarButton>
    </div>
  );
}
