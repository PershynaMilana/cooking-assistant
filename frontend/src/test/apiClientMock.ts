import { apiClient } from "api/client";

// typed handles onto the manual client mock (src/api/__mocks__/client.ts);
// a test only needs jest.mock("../client") for these to point at the mock
const mockedClient = jest.mocked(apiClient);

export const mockedGet = mockedClient.get;
export const mockedPost = mockedClient.post;
export const mockedPut = mockedClient.put;
export const mockedDelete = mockedClient.delete;

// resolve GET requests by url, for pages that hit several endpoints at once;
// an unmapped url rejects so a forgotten stub fails loudly instead of hanging
export const mockGetByUrl = (handlers: Record<string, unknown>) => {
    mockedGet.mockImplementation((url: string) =>
        url in handlers
            ? Promise.resolve({ data: handlers[url] })
            : Promise.reject(new Error(`unexpected GET ${url}`)),
    );
};
