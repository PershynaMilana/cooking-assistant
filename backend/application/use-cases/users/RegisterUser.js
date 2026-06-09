class RegisterUser {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    async execute({ name, surname, login, password }) {
        const hashedPassword = await this.passwordHasher.hash(password);
        return this.userRepository.create({
            name,
            surname,
            login,
            password: hashedPassword,
        });
    }
}

module.exports = RegisterUser;
