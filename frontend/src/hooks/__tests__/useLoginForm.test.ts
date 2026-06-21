import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import { login } from "api/authApi";

import { useLoginForm } from "hooks/useLoginForm";

import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/authApi");

const makeLimitError = (retryAfterSeconds: number | null = null) =>
    Object.assign(new Error(), {
        isAxiosError: true,
        response: {
            status: 429,
            headers:
                retryAfterSeconds !== null
                    ? { "retry-after": String(retryAfterSeconds) }
                    : {},
        },
    });

describe("useLoginForm", () => {
    it("should navigate to main on a successful login", async () => {
        jest.mocked(login).mockResolvedValue(undefined);

        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.setField("login", "tester");
        });
        act(() => {
            result.current.setField("password", "secret1");
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(login)).toHaveBeenCalledWith({
            login: "tester",
            password: "secret1",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });

    it("should set a required-fields error and not call the api when fields are empty", async () => {
        const { result } = renderHook(() => useLoginForm());

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(login)).not.toHaveBeenCalled();
        expect(result.current.error).toBe("Please fill in all fields.");
    });

    it("should set a generic error when login fails", async () => {
        jest.mocked(login).mockRejectedValue(new Error("401"));

        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.setField("login", "tester");
        });
        act(() => {
            result.current.setField("password", "wrong-pass");
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.error).toBe("Incorrect username or password.");
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    describe("lockout on 429", () => {
        it("should lock and not call the api again while locked", async () => {
            jest.mocked(login).mockRejectedValue(makeLimitError(60));

            const { result } = renderHook(() => useLoginForm());

            act(() => {
                result.current.setField("login", "tester");
            });
            act(() => {
                result.current.setField("password", "secret1");
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(result.current.isLocked).toBe(true);
            expect(jest.mocked(login)).toHaveBeenCalledTimes(1);

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(jest.mocked(login)).toHaveBeenCalledTimes(1);
        });

        it("should re-enable submission after lockout expires", async () => {
            jest.useFakeTimers();
            jest.mocked(login)
                .mockRejectedValueOnce(makeLimitError(30))
                .mockResolvedValue(undefined);

            const { result } = renderHook(() => useLoginForm());

            act(() => {
                result.current.setField("login", "tester");
            });
            act(() => {
                result.current.setField("password", "secret1");
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(result.current.isLocked).toBe(true);

            act(() => {
                jest.advanceTimersByTime(30_000);
            });

            expect(result.current.isLocked).toBe(false);

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(jest.mocked(login)).toHaveBeenCalledTimes(2);
            jest.useRealTimers();
        });

        it("should clear the lock immediately when the deadline is already in the past", async () => {
            const start = 1_000_000;
            // the deadline is computed from the first now() in the catch block;
            // every later read (re-render guard, effect) sees a clock already
            // past it, so the effect takes the remaining <= 0 reset branch
            const nowSpy = jest
                .spyOn(Date, "now")
                .mockReturnValueOnce(start)
                .mockReturnValue(start + 60_000);

            jest.mocked(login).mockRejectedValue(makeLimitError(30));

            const { result } = renderHook(() => useLoginForm());

            act(() => {
                result.current.setField("login", "tester");
            });
            act(() => {
                result.current.setField("password", "secret1");
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(result.current.isLocked).toBe(false);
            nowSpy.mockRestore();
        });

        it("should default to 60 s when retry-after header is absent", async () => {
            jest.mocked(login).mockRejectedValue(makeLimitError());

            const { result } = renderHook(() => useLoginForm());

            act(() => {
                result.current.setField("login", "tester");
            });
            act(() => {
                result.current.setField("password", "secret1");
            });

            await act(async () => {
                await result.current.handleSubmit();
            });

            expect(result.current.error).toContain("60");
        });
    });
});
