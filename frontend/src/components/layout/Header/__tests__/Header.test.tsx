import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { logout } from "api/authApi";

import { Header } from "components/layout/Header";

import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/authApi");

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

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
});
