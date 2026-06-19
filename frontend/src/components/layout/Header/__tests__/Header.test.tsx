import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { AUTH_TOKEN_KEY } from "constants/storage";

import { Header } from "components/layout/Header";

import { setAuthToken } from "test/auth";
import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("Header", () => {
    it("should show login and register links when logged out", () => {
        renderWithRouter(<Header />);

        expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Register" }),
        ).toBeInTheDocument();
    });

    it("should log out and navigate to login when the logout button is clicked", async () => {
        setAuthToken();

        renderWithRouter(<Header />);

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));

        expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
