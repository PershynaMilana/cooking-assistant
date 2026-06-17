import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../Header";
import { mockNavigate, renderWithRouter } from "../../test/router";
import { setAuthToken } from "../../test/auth";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
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

        expect(localStorage.getItem("authToken")).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
