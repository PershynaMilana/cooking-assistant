// localStorage keys. AUTH_TOKEN_KEY is load-bearing - the whole app reads/writes
// the JWT under this exact key, so the value must not change (see CLAUDE.md).
export const AUTH_TOKEN_KEY = "authToken";
