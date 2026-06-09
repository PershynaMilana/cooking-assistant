class UserController {
    constructor({ registerUser, loginUser, getUsers }) {
        this.registerUserUseCase = registerUser;
        this.loginUserUseCase = loginUser;
        this.getUsersUseCase = getUsers;
    }

    registerUser = async (req, res) => {
        const { name, surname, login, password } = req.body;
        const user = await this.registerUserUseCase.execute({
            name,
            surname,
            login,
            password,
        });

        res.status(201).json(user);
    };

    loginUser = async (req, res) => {
        const { login, password } = req.body;
        const token = await this.loginUserUseCase.execute({ login, password });
        res.json(token);
    };

    getUsers = async (_req, res) => {
        const users = await this.getUsersUseCase.execute();
        res.json(users);
    };
}

module.exports = UserController;
