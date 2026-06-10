import type {
    NewUser,
    UserRepository,
} from "../../../domain/repositories/UserRepository";
import type { PasswordHasher } from "../../ports/PasswordHasher";

export default class RegisterUser {
    constructor(
        private userRepository: Pick<UserRepository, "create">,
        private passwordHasher: Pick<PasswordHasher, "hash">,
    ) {}

    async execute({
        name,
        surname,
        login,
        password,
    }: NewUser): Promise<unknown> {
        const hashedPassword = await this.passwordHasher.hash(password);
        return this.userRepository.create({
            name,
            surname,
            login,
            password: hashedPassword,
        });
    }
}
