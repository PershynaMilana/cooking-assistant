import express, { type Router } from "express";

import type UserController from "@controller/user.controller";
import authenticateToken from "@middleware/jwtMiddleware";

export default function createUserRouter(
    userController: UserController,
): Router {
    const router = express.Router();

    // registration
    router.post("/register", userController.registerUser);

    // login
    router.post("/login", userController.loginUser);

    // get users
    router.get("/user", authenticateToken, userController.getUsers);

    return router;
}
