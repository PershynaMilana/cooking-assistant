import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import React from "react";
import { Provider } from "react-redux";
import type * as ReactRouterDom from "react-router-dom";

import { API_ROUTES } from "api/endpoints";

import { useLoginForm } from "hooks/useLoginForm";

import { mockedPost } from "test/apiClientMock";
import { mockNavigate } from "test/router";
import { makeTestStore } from "test/store";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/client");

const makeError = (status: number, retryAfter: number | null = null) =>
    Object.assign(new Error(), {
        isAxiosError: true,
        response: {
            status,
            data: { error: "Rejected" },
            headers:
                retryAfter === null
                    ? {}
                    : { "retry-after": String(retryAfter) },
        },
    });

const wrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(Provider, { store: makeTestStore(), children });

const renderLoginForm = () => renderHook(() => useLoginForm(), { wrapper });

const fillCredentials = (result: {
    current: ReturnType<typeof useLoginForm>;
}) => {
    act(() => {
        result.current.setField("login", "tester");
    });
    act(() => {
        result.current.setField("password", "secret1");
    });
};

describe("useLoginForm", () => {
    it("should navigate to main on a successful login", async () => {
        mockedPost.mockResolvedValue({ data: null });

        const { result } = renderLoginForm();

        fillCredentials(result);

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(mockedPost).toHaveBeenCalledWith(API_ROUTES.auth.login, {
            login: "tester",
            password: "secret1",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });

    it("should set a required-fields error and not call the api when fields are empty", async () => {
        const { result } = renderLoginForm();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(mockedPost).not.toHaveBeenCalled();
        expect(result.current.error).toBe("Please fill in all fields.");
    });

    it("should set a generic error when login fails", async () => {
        mockedPost.mockRejectedValue(makeError(401));

        const { result } = renderLoginForm();

        fillCredentials(result);

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.error).toBe("Incorrect username or password.");
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    describe("lockout on 429", () => {
        it("should lock and not call the api again while locked", async () => {
            mockedPost.mockRejectedValue(makeError(429));

            const { result } = renderLoginForm();

            fillCredentials(result);

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(result.current.isLocked).toBe(true);
            expect(mockedPost).toHaveBeenCalledTimes(1);

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(mockedPost).toHaveBeenCalledTimes(1);
        });

        it("should re-enable submission after lockout expires", async () => {
            jest.useFakeTimers();
            mockedPost
                .mockRejectedValueOnce(makeError(429))
                .mockResolvedValue({ data: null });

            const { result } = renderLoginForm();

            fillCredentials(result);

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(result.current.isLocked).toBe(true);

            act(() => {
                jest.advanceTimersByTime(60_000);
            });

            expect(result.current.isLocked).toBe(false);

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(mockedPost).toHaveBeenCalledTimes(2);
            jest.useRealTimers();
        });

        it("should report the cool-down in the lockout message", async () => {
            mockedPost.mockRejectedValue(makeError(429));

            const { result } = renderLoginForm();

            fillCredentials(result);

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(result.current.error).toContain("60");
        });

        it("should use the server Retry-After value for the cool-down when provided", async () => {
            mockedPost.mockRejectedValue(makeError(429, 30));

            const { result } = renderLoginForm();

            fillCredentials(result);

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(result.current.error).toContain("30");
        });
    });
});
