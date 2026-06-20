import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { login } from "api/authApi";

import LoginPage from "pages/auth/LoginPage";
import { ROUTE_MAIN } from "test/constants";
import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/authApi");

const USERNAME = "test-user";
const PASSWORD = "test-pass";

describe("LoginPage", () => {
    it("should navigate to main on successful login", async () => {
        const mockedLogin = jest.mocked(login);

        mockedLogin.mockResolvedValue(undefined);

        renderWithRouter(<LoginPage />);

        await userEvent.type(screen.getByLabelText("Username:"), USERNAME);
        await userEvent.type(screen.getByLabelText("Password:"), PASSWORD);
        await userEvent.click(screen.getByRole("button", { name: "Log In" }));

        expect(mockedLogin).toHaveBeenCalledWith({
            login: USERNAME,
            password: PASSWORD,
        });
        expect(mockNavigate).toHaveBeenCalledWith(ROUTE_MAIN);
    });
});
