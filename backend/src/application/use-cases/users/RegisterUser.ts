import type { UserRepository } from "domain/repositories/UserRepository";

import type { PasswordHasher } from "application/ports/PasswordHasher";
import { registerUserSchema } from "application/validation/user.schemas";
import { validate } from "application/validation/validate";

export default class RegisterUser {
    constructor(
        private userRepository: Pick<UserRepository, "create">,
        private passwordHasher: Pick<PasswordHasher, "hash">,
    ) {}

    async execute(input: unknown): Promise<unknown> {
        const data = validate(registerUserSchema, input);
        const hashedPassword = await this.passwordHasher.hash(data.password);

        return this.userRepository.create({
            name: data.name,
            surname: data.surname,
            login: data.login,
            password: hashedPassword,
        });
    }
}
