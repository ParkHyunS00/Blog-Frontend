export type CsrfToken = {
  token: string;
  headerName: string;
};

let csrfToken: CsrfToken | null = null;
let pendingTokenRequest: Promise<CsrfToken> | null = null;
let tokenGeneration = 0;

export function getCsrfToken(): CsrfToken | null {
  return csrfToken;
}

export function setCsrfToken(value: CsrfToken): void {
  tokenGeneration += 1;
  csrfToken = value;
  pendingTokenRequest = null;
}

export function clearCsrfToken(): void {
  tokenGeneration += 1;
  csrfToken = null;
  pendingTokenRequest = null;
}

export function ensureCsrfToken(
  fetchToken: () => Promise<CsrfToken>,
): Promise<CsrfToken> {
  if (csrfToken) return Promise.resolve(csrfToken);
  if (pendingTokenRequest) return pendingTokenRequest;

  const requestGeneration = tokenGeneration;
  const trackedRequest = fetchToken().then(
    (value) => {
      if (tokenGeneration === requestGeneration) csrfToken = value;
      if (pendingTokenRequest === trackedRequest) pendingTokenRequest = null;
      return value;
    },
    (error: unknown) => {
      if (pendingTokenRequest === trackedRequest) pendingTokenRequest = null;
      throw error;
    },
  );
  pendingTokenRequest = trackedRequest;
  return trackedRequest;
}

export function refreshCsrfToken(
  fetchToken: () => Promise<CsrfToken>,
): Promise<CsrfToken> {
  clearCsrfToken();
  return ensureCsrfToken(fetchToken);
}
