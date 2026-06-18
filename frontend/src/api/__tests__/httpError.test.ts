import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosError, AxiosHeaders } from "axios";

import { getApiErrorMessage } from "api/httpError";

const SERVER_MESSAGE = "Too many requests";
const AXIOS_MESSAGE = "Request failed with status code 429";
const UNKNOWN = "Unknown error";

const config: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };

describe("getApiErrorMessage", () => {
    it("should return the server error message from an axios error response", () => {
        const response: AxiosResponse = {
            data: { error: SERVER_MESSAGE },
            status: 429,
            statusText: "Too Many Requests",
            headers: new AxiosHeaders(),
            config,
        };
        const error = new AxiosError(
            AXIOS_MESSAGE,
            "ERR_BAD_REQUEST",
            config,
            undefined,
            response,
        );

        expect(getApiErrorMessage(error)).toBe(SERVER_MESSAGE);
    });

    it("should fall back to the axios error message when the response has no error field", () => {
        const error = new AxiosError(AXIOS_MESSAGE);

        expect(getApiErrorMessage(error)).toBe(AXIOS_MESSAGE);
    });

    it("should return a default message for a non-axios error", () => {
        expect(getApiErrorMessage(new Error("boom"))).toBe(UNKNOWN);
    });
});
