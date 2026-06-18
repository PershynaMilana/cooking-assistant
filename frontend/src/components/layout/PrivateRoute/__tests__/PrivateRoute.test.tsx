import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { PrivateRoute } from "components/layout/PrivateRoute";

import { setAuthToken } from "test/auth";

const PROTECTED = "Protected content";
const LOGIN = "Login page";
const PROTECTED_PATH = "/protected";
const LOGIN_PATH = "/login";

describe("PrivateRoute", () => {
    it("should render children when an auth token is present", () => {
        setAuthToken();

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

        expect(screen.getByText(PROTECTED)).toBeInTheDocument();
    });

    it("should redirect to login when there is no auth token", () => {
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

        expect(screen.getByText(LOGIN)).toBeInTheDocument();
        expect(screen.queryByText(PROTECTED)).not.toBeInTheDocument();
    });
});
