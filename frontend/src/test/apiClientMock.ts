import { apiClient } from "../api/client";

// typed handles onto the manual client mock (src/api/__mocks__/client.ts);
// a test only needs jest.mock("../client") for these to point at the mock
export const mockedGet = jest.mocked(apiClient.get);
export const mockedPost = jest.mocked(apiClient.post);
export const mockedPut = jest.mocked(apiClient.put);
export const mockedDelete = jest.mocked(apiClient.delete);
