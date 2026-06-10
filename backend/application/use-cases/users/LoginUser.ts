import {
    NotFoundError,
    UnauthorizedError,
} from "../../../domain/errors/AppError";
import type { PasswordHasher } from "../../ports/PasswordHasher";
import type { TokenService } from "../../ports/TokenService";
import type { UserRepository } from "../../../domain/repositories/UserRepository";

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

    async execute({ login, password }: LoginInput): Promise<{ token: string }> {
        const user = await this.userRepository.findByLogin(login);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const isPasswordValid = await this.passwordHasher.compare(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedError("Wrong password");
        }

        const token = this.tokenService.generate(user.id);
        return { token };
    }
}
