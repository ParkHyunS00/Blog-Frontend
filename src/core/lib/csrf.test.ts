import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import * as csrfModule from "./csrf.ts";

type CsrfToken = {
  token: string;
  headerName: string;
};

type CsrfModule = typeof csrfModule & {
  setCsrfToken?: (csrfToken: CsrfToken) => void;
  clearCsrfToken?: () => void;
  ensureCsrfToken?: (fetchToken: () => Promise<CsrfToken>) => Promise<CsrfToken>;
  refreshCsrfToken?: (fetchToken: () => Promise<CsrfToken>) => Promise<CsrfToken>;
};

const csrf = csrfModule as CsrfModule;
const TOKEN = { token: "xor-token", headerName: "X-XSRF-TOKEN" };

function requireCsrfMemoryApi() {
  assert.equal(typeof csrf.setCsrfToken, "function");
  assert.equal(typeof csrf.clearCsrfToken, "function");
  assert.equal(typeof csrf.ensureCsrfToken, "function");
  assert.equal(typeof csrf.refreshCsrfToken, "function");

  return {
    setCsrfToken: csrf.setCsrfToken!,
    clearCsrfToken: csrf.clearCsrfToken!,
    ensureCsrfToken: csrf.ensureCsrfToken!,
    refreshCsrfToken: csrf.refreshCsrfToken!,
  };
}

afterEach(() => {
  csrf.clearCsrfToken?.();
});

test("CSRF 응답의 토큰과 헤더 이름을 메모리에만 보관한다", () => {
  const { setCsrfToken, clearCsrfToken } = requireCsrfMemoryApi();

  setCsrfToken(TOKEN);
  assert.deepEqual(csrf.getCsrfToken(), TOKEN);

  clearCsrfToken();
  assert.equal(csrf.getCsrfToken(), null);
});

test("동시에 토큰을 요청해도 CSRF 발급 요청은 한 번만 실행한다", async () => {
  const { ensureCsrfToken } = requireCsrfMemoryApi();
  let requestCount = 0;
  let resolveToken: ((token: CsrfToken) => void) | undefined;
  const fetchToken = () => {
    requestCount += 1;
    return new Promise<CsrfToken>((resolve) => {
      resolveToken = resolve;
    });
  };

  const first = ensureCsrfToken(fetchToken);
  const second = ensureCsrfToken(fetchToken);

  assert.equal(requestCount, 1);
  resolveToken?.(TOKEN);
  assert.deepEqual(await Promise.all([first, second]), [TOKEN, TOKEN]);
});

test("CSRF 토큰을 갱신할 때 기존 값을 비운 뒤 새 값을 저장한다", async () => {
  const { setCsrfToken, refreshCsrfToken } = requireCsrfMemoryApi();
  const refreshed = { token: "new-xor-token", headerName: "X-XSRF-TOKEN" };

  setCsrfToken(TOKEN);
  const result = await refreshCsrfToken(async () => refreshed);

  assert.deepEqual(result, refreshed);
  assert.deepEqual(csrf.getCsrfToken(), refreshed);
});
