import express, { type Router } from "express";

import type UserController from "../controller/user.controller";
import asyncHandler from "../middleware/asyncHandler";
import authenticateToken from "../middleware/jwtMiddleware";

export default function createUserRouter(
    userController: UserController,
): Router {
    const router = express.Router();

    // registration
    router.post("/register", asyncHandler(userController.registerUser));

    // login
    router.post("/login", asyncHandler(userController.loginUser));

    // get users
    router.get(
        "/user",
        authenticateToken,
        asyncHandler(userController.getUsers),
    );

    return router;
}
