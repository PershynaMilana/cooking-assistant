import { act, screen } from "@testing-library/react";

import { ROUTES } from "constants/routes";

import { PrivateRoute } from "components/layout/PrivateRoute";

import { mockedGet } from "test/apiClientMock";
import { mockNavigate, renderWithProviders } from "test/router";
import { makeTestStore } from "test/store";

jest.mock("api/client");

const PROTECTED = "Protected content";
const PROTECTED_PATH = "/protected";
const SESSION_ERROR = "Could not verify session. Please refresh the page.";
const LOGIN_REDIRECT_KEY = "login-redirect";

// the guest redirect fires from an effect, one commit after the render that saw the guest state
const flushRedirect = () =>
    act(async () => {
        await Promise.resolve();
    });

const renderAs = (status: "checking" | "authed" | "guest") =>
    renderWithProviders(
        <PrivateRoute>
            <div>{PROTECTED}</div>
        </PrivateRoute>,
        {
            store: makeTestStore({ session: { status } }),
            initialEntries: [PROTECTED_PATH],
        },
    );

describe("PrivateRoute", () => {
    it("should render children for an authenticated session", () => {
        renderAs("authed");

        expect(screen.getByText(PROTECTED)).toBeInTheDocument();
    });

    it("should redirect to login for a guest", async () => {
        renderAs("guest");
        await flushRedirect();

        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.login);
        expect(screen.queryByText(PROTECTED)).not.toBeInTheDocument();
    });

    it("should record the page the guest was trying to reach before redirecting to login", async () => {
        renderAs("guest");
        await flushRedirect();

        expect(sessionStorage.getItem(LOGIN_REDIRECT_KEY)).toBe(PROTECTED_PATH);
    });

    it("should show a session error when getMe rejects with a genuine failure", async () => {
        mockedGet.mockRejectedValue(new Error("Network error"));

        renderWithProviders(
            <PrivateRoute>
                <div>{PROTECTED}</div>
            </PrivateRoute>,
            { initialEntries: [PROTECTED_PATH] },
        );

        expect(await screen.findByText(SESSION_ERROR)).toBeInTheDocument();
        expect(screen.queryByText(PROTECTED)).not.toBeInTheDocument();
    });
});
