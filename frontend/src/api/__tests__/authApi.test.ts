import { API_ROUTES } from "../endpoints";
import { login, register } from "../authApi";
import { mockedPost } from "../../test/apiClientMock";

jest.mock("../client");

const TOKEN = "jwt-token";
const CREDENTIALS = { login: "tester", password: "secret1" };
const REGISTRATION = {
    name: "Test",
    surname: "User",
    login: "tester",
    password: "secret1",
};

describe("authApi", () => {
    it("should post credentials to the login endpoint and return the token", async () => {
        mockedPost.mockResolvedValue({ data: { token: TOKEN } });

        const result = await login(CREDENTIALS);

        expect(mockedPost).toHaveBeenCalledWith(
            API_ROUTES.auth.login,
            CREDENTIALS,
        );
        expect(result).toEqual({ token: TOKEN });
    });

    it("should post the registration data to the register endpoint", async () => {
        mockedPost.mockResolvedValue({ data: undefined });

        await register(REGISTRATION);

        expect(mockedPost).toHaveBeenCalledWith(
            API_ROUTES.auth.register,
            REGISTRATION,
        );
    });
});
