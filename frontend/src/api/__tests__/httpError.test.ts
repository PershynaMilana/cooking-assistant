import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { AxiosError, AxiosHeaders } from "axios";

import { getApiErrorMessage, getApiErrorStatus } from "api/httpError";

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

    it("should return the error message for a plain Error instance", () => {
        expect(getApiErrorMessage(new Error("boom"))).toBe("boom");
    });

    it("should return a default message for a non-Error non-axios throw", () => {
        expect(getApiErrorMessage("raw string")).toBe(UNKNOWN);
    });
});

describe("getApiErrorStatus", () => {
    it("should return the status from an axios error response", () => {
        const response: AxiosResponse = {
            data: {},
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

        expect(getApiErrorStatus(error)).toBe(429);
    });

    it("should return undefined for an axios error without a response", () => {
        expect(
            getApiErrorStatus(new AxiosError(AXIOS_MESSAGE)),
        ).toBeUndefined();
    });

    it("should return undefined for a non-axios error", () => {
        expect(getApiErrorStatus(new Error("boom"))).toBeUndefined();
    });
});
