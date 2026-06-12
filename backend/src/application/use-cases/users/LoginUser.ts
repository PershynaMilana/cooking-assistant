import { UnauthorizedError } from "@domain/errors/AppError";
import type { PasswordHasher } from "@application/ports/PasswordHasher";
import type { TokenService } from "@application/ports/TokenService";
import { validate } from "@application/validation/validate";
import { loginUserSchema } from "@application/validation/user.schemas";
import type { UserRepository } from "@domain/repositories/UserRepository";

interface LoginInput {
    login: string;
    password: string;
}

export default class LoginUser {
    constructor(
        private userRepository: Pick<UserRepository, "findByLogin">,
        private passwordHasher: Pick<PasswordHasher, "compare">,
        private tokenService: Pick<TokenService, "generate">,
    ) {}

    async execute(input: LoginInput): Promise<{ token: string }> {
        const data = validate(loginUserSchema, input);
        // same error for unknown login and wrong password to prevent login enumeration
        const user = await this.userRepository.findByLogin(data.login);
        if (!user) {
            throw new UnauthorizedError("Invalid login or password");
        }

        const isPasswordValid = await this.passwordHasher.compare(
            data.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid login or password");
        }

        const token = this.tokenService.generate(user.id);
        return { token };
    }
}
