import {
    FALLBACK_ERROR_MESSAGE,
    getErrorMessage,
} from "redux/middleware/notificationsListener";
import { authApi } from "redux/services/authApi";

import { mockedPost } from "test/apiClientMock";
import { makeTestStore } from "test/store";

jest.mock("api/client");

const CREDENTIALS = { login: "a", password: "b" };

describe("getErrorMessage", () => {
    it("should return the data message from a query error payload", () => {
        expect(getErrorMessage({ status: 404, data: "Not found" })).toBe(
            "Not found",
        );
    });

    it("should fall back for a null payload", () => {
        expect(getErrorMessage(null)).toBe(FALLBACK_ERROR_MESSAGE);
    });

    it("should fall back for an object without a data field", () => {
        expect(getErrorMessage({ status: 500 })).toBe(FALLBACK_ERROR_MESSAGE);
    });

    it("should fall back when data is not a string", () => {
        expect(getErrorMessage({ data: 123 })).toBe(FALLBACK_ERROR_MESSAGE);
    });
});

describe("notificationsListener", () => {
    it("should add an error notification when a request fails", async () => {
        mockedPost.mockRejectedValue({
            isAxiosError: true,
            response: { status: 401, data: { error: "Bad credentials" } },
            message: "Request failed",
        });
        const store = makeTestStore();

        await store.dispatch(authApi.endpoints.login.initiate(CREDENTIALS));

        const { items } = store.getState().notifications;

        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({
            type: "error",
            message: "Bad credentials",
        });
    });
});
