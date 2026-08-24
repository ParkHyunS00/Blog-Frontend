import assert from "node:assert/strict";
import test from "node:test";
import { getErrorToastMessage } from "./error-toast.ts";

test("서버 Error 메시지를 토스트에 사용한다", () => {
  assert.equal(getErrorToastMessage(new Error("지원하지 않는 이미지 형식입니다."), "업로드에 실패했습니다."), "지원하지 않는 이미지 형식입니다.");
});

test("메시지를 알 수 없는 오류에는 기본 문구를 사용한다", () => {
  assert.equal(getErrorToastMessage({ code: "UNKNOWN" }, "업로드에 실패했습니다."), "업로드에 실패했습니다.");
});
