import express, { type Router } from "express";

import { ROUTES } from "constants/routes";

import type UserIngredientsController from "controller/userIngredients.controller";
import authenticateToken from "middleware/jwtMiddleware";

export default function createUserIngredientsRouter(
    userIngredientsController: UserIngredientsController,
): Router {
    const router = express.Router();

    // the user always comes from the auth cookie, never from the path

    router.get(
        ROUTES.userIngredients.list,
        authenticateToken,
        userIngredientsController.getUserIngredients,
    );

    router.put(
        ROUTES.userIngredients.list,
        authenticateToken,
        userIngredientsController.updateUserIngredients,
    );

    router.put(
        ROUTES.userIngredients.purchase,
        authenticateToken,
        userIngredientsController.updatePurchaseQuantity,
    );

    router.get(
        ROUTES.userIngredients.purchaseHistory,
        authenticateToken,
        userIngredientsController.getPurchaseHistory,
    );

    router.delete(
        ROUTES.userIngredients.byIngredient,
        authenticateToken,
        userIngredientsController.deleteUserIngredient,
    );

    return router;
}
