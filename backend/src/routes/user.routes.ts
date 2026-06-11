import express, { type Router } from "express";

import type UserController from "@controller/user.controller";
import authenticateToken from "@middleware/jwtMiddleware";
import { authLimiter } from "@middleware/rateLimit";

export default function createUserRouter(
    userController: UserController,
): Router {
    const router = express.Router();

    // registration
    router.post("/register", authLimiter, userController.registerUser);

    // login
    router.post("/login", authLimiter, userController.loginUser);

    // get users
    router.get("/user", authenticateToken, userController.getUsers);

    return router;
}
