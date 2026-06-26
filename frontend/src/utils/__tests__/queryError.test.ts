import {
    getQueryErrorMessage,
    getQueryErrorRetryAfter,
    getQueryErrorStatus,
} from "utils/queryError";

describe("getQueryErrorMessage", () => {
    it("should return the data string from an axios base query error", () => {
        expect(getQueryErrorMessage({ status: 500, data: "Boom" })).toBe(
            "Boom",
        );
    });

    it("should fall back when the error has no string data", () => {
        expect(getQueryErrorMessage({ status: 500 })).toBe(
            "Something went wrong",
        );
    });

    it("should fall back for an unknown error shape", () => {
        expect(getQueryErrorMessage(undefined)).toBe("Something went wrong");
    });
});

describe("getQueryErrorStatus", () => {
    it("should return the numeric status from a query error", () => {
        expect(getQueryErrorStatus({ status: 401, data: "x" })).toBe(401);
    });

    it("should return null when there is no numeric status", () => {
        expect(getQueryErrorStatus({ data: "x" })).toBeNull();
        expect(getQueryErrorStatus(undefined)).toBeNull();
    });
});

describe("getQueryErrorRetryAfter", () => {
    it("should return the numeric retryAfter from a query error", () => {
        expect(getQueryErrorRetryAfter({ retryAfter: 30 })).toBe(30);
    });

    it("should return null when retryAfter is not a number", () => {
        expect(getQueryErrorRetryAfter({ retryAfter: null })).toBeNull();
        expect(getQueryErrorRetryAfter(undefined)).toBeNull();
    });
});
