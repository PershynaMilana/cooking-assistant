import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { register } from "api/authApi";

import RegisterPage from "pages/auth/RegisterPage";
import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("../../../api/authApi");

const NAME = "Test";
const SURNAME = "User";
const LOGIN = "tester";
const PASSWORD = "secret1";

describe("RegisterPage", () => {
    it("should register the user and navigate to login on submit", async () => {
        const mockedRegister = jest.mocked(register);

        mockedRegister.mockResolvedValue(undefined);

        renderWithRouter(<RegisterPage />);

        await userEvent.type(screen.getByLabelText("Name:"), NAME);
        await userEvent.type(screen.getByLabelText("Surname:"), SURNAME);
        await userEvent.type(screen.getByLabelText("Username:"), LOGIN);
        await userEvent.type(screen.getByLabelText("Password:"), PASSWORD);
        await userEvent.click(screen.getByRole("button", { name: "Register" }));

        expect(mockedRegister).toHaveBeenCalledWith({
            name: NAME,
            surname: SURNAME,
            login: LOGIN,
            password: PASSWORD,
        });
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
});
