import express, { type Router } from "express";

import type UserController from "controller/user.controller";
import authenticateToken from "middleware/jwtMiddleware";
import { authLimiter } from "middleware/rateLimit";

export default function createUserRouter(
    userController: UserController,
): Router {
    const router = express.Router();

    router.post("/register", authLimiter, userController.registerUser);
    router.post("/login", authLimiter, userController.loginUser);
    router.post("/logout", userController.logout);
    router.get("/me", authenticateToken, userController.me);
    router.get("/user", authenticateToken, userController.getUsers);

    return router;
}
