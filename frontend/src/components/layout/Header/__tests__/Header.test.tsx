import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { API_ROUTES } from "api/endpoints";

import { Header } from "components/layout/Header";

import { mockedPost } from "test/apiClientMock";
import { flushMacrotasks as flush } from "test/flush";
import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/client");

describe("Header", () => {
    it("should show login and register links on the login page", () => {
        renderWithRouter(<Header />, ["/login"]);

        expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Register" }),
        ).toBeInTheDocument();
    });

    it("should log out and navigate to login when the logout button is clicked", async () => {
        mockedPost.mockResolvedValue({ data: null });

        renderWithRouter(<Header />, ["/main"]);

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));
        await flush();

        expect(mockedPost).toHaveBeenCalledWith(
            API_ROUTES.auth.logout,
            undefined,
        );
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should notify and not navigate when logout fails", async () => {
        mockedPost.mockRejectedValue(
            Object.assign(new Error(), {
                isAxiosError: true,
                response: { status: 500, data: { error: "Boom" } },
            }),
        );

        const { store } = renderWithRouter(<Header />, ["/main"]);

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));
        await flush();

        expect(store.getState().notifications.items).toEqual([
            expect.objectContaining({ type: "error", message: "Boom" }),
        ]);
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
