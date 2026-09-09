import express, { type Router } from "express";

import { ROUTES } from "constants/routes";

import type UserController from "controller/user.controller";
import authenticateToken from "middleware/jwtMiddleware";
import optionalAuth from "middleware/optionalAuth";
import {
    changePasswordLimiter,
    confirmEmailLimiter,
    deleteAccountLimiter,
    forgotPasswordLimiter,
    loginIpLimiter,
    loginLimiter,
    registerIpLimiter,
    registerLimiter,
    resendVerificationLimiter,
    resetPasswordLimiter,
} from "middleware/rateLimit";

export default function createUserRouter(
    userController: UserController,
): Router {
    const router = express.Router();

    router.post(
        ROUTES.auth.register,
        registerIpLimiter,
        registerLimiter,
        userController.registerUser,
    );
    router.post(
        ROUTES.auth.login,
        loginIpLimiter,
        loginLimiter,
        userController.loginUser,
    );
    router.post(ROUTES.auth.logout, userController.logout);
    router.get(ROUTES.auth.me, optionalAuth, userController.me);
    router.post(
        ROUTES.auth.forgotPassword,
        forgotPasswordLimiter,
        userController.requestPasswordReset,
    );
    router.post(
        ROUTES.auth.resetPassword,
        resetPasswordLimiter,
        userController.confirmPasswordReset,
    );
    router.post(
        ROUTES.auth.changePassword,
        authenticateToken,
        changePasswordLimiter,
        userController.changePassword,
    );
    router.patch(
        ROUTES.auth.me,
        authenticateToken,
        userController.updateProfile,
    );
    router.delete(
        ROUTES.auth.me,
        authenticateToken,
        deleteAccountLimiter,
        userController.deleteAccount,
    );
    router.post(
        ROUTES.auth.resendVerificationEmail,
        authenticateToken,
        resendVerificationLimiter,
        userController.requestEmailVerification,
    );
    router.post(
        ROUTES.auth.confirmEmail,
        confirmEmailLimiter,
        userController.confirmEmailVerification,
    );

    return router;
}
