// next/headers reads the incoming request, which exists only during a server render. This
// stands in for it with real, writable state, so the forwarding logic in api/server is
// exercised rather than stubbed (same approach as nextNavigationMock).
let requestCookies = new Map<string, string>();
let requestHeaders = new Headers();

export const setTestCookies = (init: Record<string, string>): void => {
    requestCookies = new Map(Object.entries(init));
};

export const setTestRequestHeaders = (init: Record<string, string>): void => {
    requestHeaders = new Headers(init);
};

export const resetTestRequest = (): void => {
    requestCookies = new Map();
    requestHeaders = new Headers();
};

export const cookies = () =>
    Promise.resolve({
        get: (name: string) => {
            const value = requestCookies.get(name);

            return value ? { name, value } : undefined;
        },
    });

export const headers = () => Promise.resolve(requestHeaders);
