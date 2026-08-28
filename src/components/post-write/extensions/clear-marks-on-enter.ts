import { Extension } from "@tiptap/react";

export const ClearMarksOnEnter = Extension.create({
  name: "clearMarksOnEnter",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        // 코드블록, 리스트 내부에서는 기본 동작 유지
        if (
          editor.isActive("codeBlock") ||
          editor.isActive("bulletList") ||
          editor.isActive("orderedList")
        ) {
          return false;
        }

        // blockquote: Enter로 인용 탈출
        if (editor.isActive("blockquote")) {
          // 현재 블록을 분리하고 blockquote 밖으로 이동
          editor.chain()
            .splitBlock()
            .liftEmptyBlock()
            .run();
          return true;
        }

        const isHeading = editor.isActive("heading");

        // 기본 Enter 동작 실행 (새 줄 생성)
        editor.commands.splitBlock();

        // 헤딩이었으면 새 줄을 paragraph로 전환
        if (isHeading) {
          editor.commands.setNode("paragraph");
        }

        // stored marks 초기화 → 새 줄은 일반 텍스트로 시작
        editor.view.dispatch(editor.state.tr.setStoredMarks([]));

        return true;
      },
    };
  },
});
