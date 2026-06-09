const {
    NotFoundError,
    UnauthorizedError,
} = require("../../../domain/errors/AppError");

class LoginUser {
    constructor(userRepository, passwordHasher, tokenService) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }

    async execute({ login, password }) {
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

module.exports = LoginUser;
