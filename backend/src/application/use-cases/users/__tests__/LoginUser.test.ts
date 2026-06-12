import LoginUser from "@application/use-cases/users/LoginUser";
import { UnauthorizedError } from "@domain/errors/AppError";
import { catchError } from "@test/helpers/assertions";

function setup() {
    const userRepository = { findByLogin: jest.fn() };
    const passwordHasher = { compare: jest.fn() };
    const tokenService = { generate: jest.fn() };
    const useCase = new LoginUser(userRepository, passwordHasher, tokenService);

    return {
        useCase,
        userRepository,
        passwordHasher,
        tokenService,
    };
}

function makeCredentials(overrides = {}) {
    return {
        login: "bob",
        password: "x",
        ...overrides,
    };
}

describe("LoginUser", () => {
    it("should throw a 401 UnauthorizedError when the user does not exist", async () => {
        const { useCase, userRepository } = setup();
        userRepository.findByLogin.mockResolvedValue(null);

        const error = await catchError(useCase.execute(makeCredentials()));

        expect(error).toBeAppError(
            UnauthorizedError,
            "Invalid login or password",
            401,
        );
    });

    it("should throw a 401 UnauthorizedError when the password is wrong", async () => {
        const { useCase, userRepository, passwordHasher } = setup();
        userRepository.findByLogin.mockResolvedValue({
            id: 1,
            password: "hash",
        });
        passwordHasher.compare.mockResolvedValue(false);

        const error = await catchError(useCase.execute(makeCredentials()));

        expect(error).toBeAppError(
            UnauthorizedError,
            "Invalid login or password",
            401,
        );
    });

    it("should return a token for valid credentials", async () => {
        const { useCase, userRepository, passwordHasher, tokenService } =
            setup();
        userRepository.findByLogin.mockResolvedValue({
            id: 7,
            password: "hash",
        });
        passwordHasher.compare.mockResolvedValue(true);
        tokenService.generate.mockReturnValue("jwt-token");

        const result = await useCase.execute(
            makeCredentials({ password: "secret" }),
        );

        expect(passwordHasher.compare).toHaveBeenCalledWith("secret", "hash");
        expect(tokenService.generate).toHaveBeenCalledWith(7);
        expect(result).toEqual({ token: "jwt-token" });
    });
});
