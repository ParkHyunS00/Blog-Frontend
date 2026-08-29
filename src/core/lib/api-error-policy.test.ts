import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

type ApiErrorAction = {
  invalidateAuthStatus: boolean;
  redirectToLogin: boolean;
  errorKind: "FORBIDDEN" | "NOT_FOUND" | null;
};

type ResolveApiErrorAction = (
  status: number,
  options: { isAuthStatusFailure?: boolean; handlesAuthErrorLocally?: boolean },
) => ApiErrorAction;

async function loadPolicy(): Promise<ResolveApiErrorAction | null> {
  try {
    const module = await import("./api-error-policy.ts");
    return module.resolveApiErrorAction as ResolveApiErrorAction;
  } catch {
    return null;
  }
}

test("로컬에서 처리하는 인증 mutation의 401과 403은 전역 화면으로 전달하지 않는다", async () => {
  const resolveApiErrorAction = await loadPolicy();
  assert.equal(typeof resolveApiErrorAction, "function");

  const expected = {
    invalidateAuthStatus: false,
    redirectToLogin: false,
    errorKind: null,
  };
  assert.deepEqual(resolveApiErrorAction!(401, { handlesAuthErrorLocally: true }), expected);
  assert.deepEqual(resolveApiErrorAction!(403, { handlesAuthErrorLocally: true }), expected);
});

test("보호 자원 요청의 401과 403은 기존 전역 처리를 유지한다", async () => {
  const resolveApiErrorAction = await loadPolicy();
  assert.equal(typeof resolveApiErrorAction, "function");

  assert.deepEqual(resolveApiErrorAction!(401, {}), {
    invalidateAuthStatus: true,
    redirectToLogin: true,
    errorKind: null,
  });
  assert.deepEqual(resolveApiErrorAction!(403, {}), {
    invalidateAuthStatus: true,
    redirectToLogin: false,
    errorKind: "FORBIDDEN",
  });
});

test("Admin Key와 OTP mutation은 인증 오류를 폼에서 처리하도록 표시한다", async () => {
  const files = [
    "../../features/admin-auth/hooks/mutations/use-admin-key-mutation.ts",
    "../../features/admin-auth/hooks/mutations/use-otp-mutation.ts",
  ];

  for (const file of files) {
    const source = await readFile(new URL(file, import.meta.url), "utf8");
    assert.equal(source.includes("meta: { handlesAuthErrorLocally: true }"), true);
  }
});
