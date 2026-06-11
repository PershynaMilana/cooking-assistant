import type {
    NewUser,
    UserRepository,
} from "@domain/repositories/UserRepository";
import { validate } from "@application/validation/validate";
import { registerUserSchema } from "@application/validation/user.schemas";
import type { PasswordHasher } from "@application/ports/PasswordHasher";

export default class RegisterUser {
    constructor(
        private userRepository: Pick<UserRepository, "create">,
        private passwordHasher: Pick<PasswordHasher, "hash">,
    ) {}

    async execute(input: NewUser): Promise<unknown> {
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
