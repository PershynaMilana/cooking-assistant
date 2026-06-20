import type { RequestHandler } from "express";

import type GetUsers from "@application/use-cases/users/GetUsers";
import type LoginUser from "@application/use-cases/users/LoginUser";
import type RegisterUser from "@application/use-cases/users/RegisterUser";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@config/cookie";
import { getUserId } from "@controller/requestUser";

interface UserControllerDependencies {
    registerUser: RegisterUser;
    loginUser: LoginUser;
    getUsers: GetUsers;
}

export default class UserController {
    private registerUserUseCase: RegisterUser;
    private loginUserUseCase: LoginUser;
    private getUsersUseCase: GetUsers;

    constructor({
        registerUser,
        loginUser,
        getUsers,
    }: UserControllerDependencies) {
        this.registerUserUseCase = registerUser;
        this.loginUserUseCase = loginUser;
        this.getUsersUseCase = getUsers;
    }

    registerUser: RequestHandler = async (req, res) => {
        const { name, surname, login, password } = req.body;
        const user = await this.registerUserUseCase.execute({
            name,
            surname,
            login,
            password,
        });

        res.status(201).json(user);
    };

    loginUser: RequestHandler = async (req, res) => {
        const { login, password } = req.body;
        const { token } = await this.loginUserUseCase.execute({
            login,
            password,
        });

        res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
        res.json({ message: "Logged in" });
    };

    logout: RequestHandler = (_req, res) => {
        res.clearCookie(AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
        res.json({ message: "Logged out" });
    };

    me: RequestHandler = (req, res) => {
        res.json({ id: getUserId(req) });
    };

    getUsers: RequestHandler = async (_req, res) => {
        const users = await this.getUsersUseCase.execute();
        res.json(users);
    };
}
