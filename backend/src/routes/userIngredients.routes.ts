import express, { type Router } from "express";

import type UserIngredientsController from "@controller/userIngredients.controller";
import authenticateToken from "@middleware/jwtMiddleware";

export default function createUserIngredientsRouter(
    userIngredientsController: UserIngredientsController,
): Router {
    const router = express.Router();

    // the user always comes from the auth cookie, never from the path

    // get user ingredients
    router.get(
        "/user-ingredients",
        authenticateToken,
        userIngredientsController.getUserIngredients,
    );

    // update user ingredients
    router.put(
        "/user-ingredients",
        authenticateToken,
        userIngredientsController.updateUserIngredients,
    );

    // update ingredient quantities
    router.put(
        "/user-ingredients/update-quantities",
        authenticateToken,
        userIngredientsController.updateIngredientQuantities,
    );

    // update one purchase record
    router.put(
        "/user-ingredients/history/:purchaseId",
        authenticateToken,
        userIngredientsController.updatePurchaseQuantity,
    );

    // get purchase history for one ingredient
    router.get(
        "/user-ingredients/history/:ingredientId",
        authenticateToken,
        userIngredientsController.getPurchaseHistory,
    );

    // delete one ingredient
    router.delete(
        "/user-ingredients/:ingredientId",
        authenticateToken,
        userIngredientsController.deleteUserIngredient,
    );

    return router;
}
