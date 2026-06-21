import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { logout } from "api/authApi";

import { Header } from "components/layout/Header";

import { flushMicrotasks as flush } from "test/flush";
import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/authApi");

describe("Header", () => {
    it("should show login and register links on the login page", () => {
        renderWithRouter(<Header />, ["/login"]);

        expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Register" }),
        ).toBeInTheDocument();
    });

    it("should log out and navigate to login when the logout button is clicked", async () => {
        jest.mocked(logout).mockResolvedValue(undefined);

        renderWithRouter(<Header />, ["/main"]);

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));
        await flush();

        expect(jest.mocked(logout)).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    it("should show an error message when logout fails", async () => {
        jest.mocked(logout).mockRejectedValue(new Error("network"));

        renderWithRouter(<Header />, ["/main"]);

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));
        await flush();

        expect(
            screen.getByText("Logout failed. Please try again."),
        ).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
