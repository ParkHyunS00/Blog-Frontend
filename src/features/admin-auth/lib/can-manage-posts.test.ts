import assert from "node:assert/strict";
import test from "node:test";
import { canManagePosts } from "./can-manage-posts.ts";

test("인증된 관리자에게만 게시글 관리 권한을 노출한다", () => {
  assert.equal(canManagePosts({ authenticated: true, step: "AUTHENTICATED" }), true);
  assert.equal(canManagePosts({ authenticated: false, step: "ADMIN_KEY_REQUIRED" }), false);
  assert.equal(canManagePosts(undefined), false);
});

test("인증 응답의 두 필드가 일치하지 않으면 관리 권한을 노출하지 않는다", () => {
  assert.equal(canManagePosts({ authenticated: false, step: "AUTHENTICATED" }), false);
});
