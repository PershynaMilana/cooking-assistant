import { getMe, login, logout, register } from "api/authApi";
import { API_ROUTES } from "api/endpoints";

import { mockedGet, mockedPost } from "test/apiClientMock";

jest.mock("../client");

const CREDENTIALS = { login: "tester", password: "secret1" };
const REGISTRATION = {
    name: "Test",
    surname: "User",
    login: "tester",
    password: "secret1",
};

describe("authApi", () => {
    it("should post credentials to the login endpoint", async () => {
        mockedPost.mockResolvedValue({ data: { message: "Logged in" } });

        await login(CREDENTIALS);

        expect(mockedPost).toHaveBeenCalledWith(
            API_ROUTES.auth.login,
            CREDENTIALS,
        );
    });

    it("should post the registration data to the register endpoint", async () => {
        mockedPost.mockResolvedValue({ data: undefined });

        await register(REGISTRATION);

        expect(mockedPost).toHaveBeenCalledWith(
            API_ROUTES.auth.register,
            REGISTRATION,
        );
    });

    it("should get the current user from the me endpoint", async () => {
        mockedGet.mockResolvedValue({ data: { id: 1 } });

        await getMe();

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.auth.me);
    });

    it("should post to the logout endpoint", async () => {
        mockedPost.mockResolvedValue({ data: { message: "Logged out" } });

        await logout();

        expect(mockedPost).toHaveBeenCalledWith(API_ROUTES.auth.logout);
    });
});
