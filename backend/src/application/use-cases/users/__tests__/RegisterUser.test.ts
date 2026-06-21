import { ValidationError } from "domain/errors/AppError";

import RegisterUser from "application/use-cases/users/RegisterUser";

import { catchError } from "test/helpers/assertions";

describe("RegisterUser", () => {
    const makeDeps = () => ({
        userRepository: { create: jest.fn() },
        passwordHasher: { hash: jest.fn() },
    });

    it("should hash the password and create a user with the hashed password", async () => {
        const deps = makeDeps();
        const createdUser = {
            id: 5,
            name: "Bob",
            surname: "Cook",
            login: "bob",
        };

        deps.passwordHasher.hash.mockResolvedValue("hashed-secret");
        deps.userRepository.create.mockResolvedValue(createdUser);
        const useCase = new RegisterUser(
            deps.userRepository,
            deps.passwordHasher,
        );

        const result = await useCase.execute({
            name: "Bob",
            surname: "Cook",
            login: "bob",
            password: "secret",
        });

        expect(deps.passwordHasher.hash).toHaveBeenCalledWith("secret");
        expect(deps.userRepository.create).toHaveBeenCalledWith({
            name: "Bob",
            surname: "Cook",
            login: "bob",
            password: "hashed-secret",
        });
        expect(result).toEqual(createdUser);
    });

    it("should throw a 400 ValidationError when password is too short", async () => {
        const deps = makeDeps();
        const useCase = new RegisterUser(
            deps.userRepository,
            deps.passwordHasher,
        );

        const error = await catchError(
            useCase.execute({
                name: "Bob",
                surname: "Cook",
                login: "bob",
                password: "",
            }),
        );

        expect(error).toBeAppError(
            ValidationError,
            "password: Password must be at least 6 characters",
            400,
        );
        expect(deps.passwordHasher.hash).not.toHaveBeenCalled();
        expect(deps.userRepository.create).not.toHaveBeenCalled();
    });
});
