import assert from "node:assert/strict";
import test from "node:test";
import { toEditorImageUpload } from "./editor-image-upload.ts";

test("업로드 응답의 실제 이미지 크기를 에디터 이미지 속성으로 전달한다", () => {
  assert.deepEqual(
    toEditorImageUpload(
      {
        imageId: 12,
        type: "CONTENT",
        objectKey: "posts/content/12.webp",
        mimeType: "image/webp",
        width: 1536,
        height: 922,
      },
      "https://api.example.com",
    ),
    {
      src: "https://api.example.com/api/post-images/12",
      width: 1536,
      height: 922,
    },
  );
});
