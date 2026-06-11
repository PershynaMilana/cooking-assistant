import express, { type Router } from "express";

import type UserIngredientsController from "@controller/userIngredients.controller";
import authenticateToken from "@middleware/jwtMiddleware";

export default function createUserIngredientsRouter(
    userIngredientsController: UserIngredientsController,
): Router {
    const router = express.Router();

    // get user ingredients
    router.get(
        "/user-ingredients/:id",
        authenticateToken,
        userIngredientsController.getUserIngredients,
    );

    // update user ingredients
    router.put(
        "/user-ingredients/:id",
        authenticateToken,
        userIngredientsController.updateUserIngredients,
    );

    // delete ingredient for specific user
    router.delete(
        "/user-ingredients/:userId/:ingredientId",
        authenticateToken,
        userIngredientsController.deleteUserIngredient,
    );

    // update ingredient quantities
    router.put(
        "/user-ingredients/update-quantities/:userId",
        authenticateToken,
        userIngredientsController.updateIngredientQuantities,
    );

    router.put(
        "/user-ingredients/:userId/history/:purchaseId",
        authenticateToken,
        userIngredientsController.updatePurchaseQuantity,
    );

    router.get(
        "/user-ingredients/:userId/history/:ingredientId",
        authenticateToken,
        userIngredientsController.getPurchaseHistory,
    );

    return router;
}
