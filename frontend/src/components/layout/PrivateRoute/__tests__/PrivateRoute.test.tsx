import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { getMe } from "api/authApi";

import { PrivateRoute } from "components/layout/PrivateRoute";

jest.mock("api/authApi");

const PROTECTED = "Protected content";
const LOGIN = "Login page";
const PROTECTED_PATH = "/protected";
const LOGIN_PATH = "/login";

const makeAuthError = (status: number) =>
    Object.assign(new Error(), {
        isAxiosError: true,
        response: { status },
    });

describe("PrivateRoute", () => {
    it("should render children when getMe resolves", async () => {
        jest.mocked(getMe).mockResolvedValue(undefined);

        render(
            <MemoryRouter initialEntries={[PROTECTED_PATH]}>
                <Routes>
                    <Route
                        path={PROTECTED_PATH}
                        element={
                            <PrivateRoute>
                                <div>{PROTECTED}</div>
                            </PrivateRoute>
                        }
                    />
                    <Route path={LOGIN_PATH} element={<div>{LOGIN}</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByText(PROTECTED)).toBeInTheDocument();
    });

    it("should redirect to login when getMe rejects with 401", async () => {
        jest.mocked(getMe).mockRejectedValue(makeAuthError(401));

        render(
            <MemoryRouter initialEntries={[PROTECTED_PATH]}>
                <Routes>
                    <Route
                        path={PROTECTED_PATH}
                        element={
                            <PrivateRoute>
                                <div>{PROTECTED}</div>
                            </PrivateRoute>
                        }
                    />
                    <Route path={LOGIN_PATH} element={<div>{LOGIN}</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByText(LOGIN)).toBeInTheDocument();
        expect(screen.queryByText(PROTECTED)).not.toBeInTheDocument();
    });

    it("should redirect to login when getMe rejects with 403", async () => {
        jest.mocked(getMe).mockRejectedValue(makeAuthError(403));

        render(
            <MemoryRouter initialEntries={[PROTECTED_PATH]}>
                <Routes>
                    <Route
                        path={PROTECTED_PATH}
                        element={
                            <PrivateRoute>
                                <div>{PROTECTED}</div>
                            </PrivateRoute>
                        }
                    />
                    <Route path={LOGIN_PATH} element={<div>{LOGIN}</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {
            await Promise.resolve();
        });

        expect(screen.getByText(LOGIN)).toBeInTheDocument();
        expect(screen.queryByText(PROTECTED)).not.toBeInTheDocument();
    });

    it("should show a session error when getMe rejects with a non-auth error", async () => {
        jest.mocked(getMe).mockRejectedValue(new Error("Network error"));

        render(
            <MemoryRouter initialEntries={[PROTECTED_PATH]}>
                <Routes>
                    <Route
                        path={PROTECTED_PATH}
                        element={
                            <PrivateRoute>
                                <div>{PROTECTED}</div>
                            </PrivateRoute>
                        }
                    />
                    <Route path={LOGIN_PATH} element={<div>{LOGIN}</div>} />
                </Routes>
            </MemoryRouter>,
        );

        await act(async () => {
            await Promise.resolve();
        });

        expect(
            await screen.findByText(
                "Could not verify session. Please refresh the page.",
            ),
        ).toBeInTheDocument();
        expect(screen.queryByText(PROTECTED)).not.toBeInTheDocument();
        expect(screen.queryByText(LOGIN)).not.toBeInTheDocument();
    });
});
