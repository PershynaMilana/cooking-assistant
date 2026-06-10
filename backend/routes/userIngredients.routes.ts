import express, { type Router } from "express";

import type UserIngredientsController from "../controller/userIngredients.controller";
import asyncHandler from "../middleware/asyncHandler";
import authenticateToken from "../middleware/jwtMiddleware";

export default function createUserIngredientsRouter(
    userIngredientsController: UserIngredientsController,
): Router {
    const router = express.Router();

    // get user ingredients
    router.get(
        "/user-ingredients/:id",
        authenticateToken,
        asyncHandler(userIngredientsController.getUserIngredients),
    );

    // update user ingredients
    router.put(
        "/user-ingredients/:id",
        authenticateToken,
        asyncHandler(userIngredientsController.updateUserIngredients),
    );

    // delete ingredient for specific user
    router.delete(
        "/user-ingredients/:userId/:ingredientId",
        authenticateToken,
        asyncHandler(userIngredientsController.deleteUserIngredient),
    );

    // update ingredient quantities
    router.put(
        "/user-ingredients/update-quantities/:userId",
        authenticateToken,
        asyncHandler(userIngredientsController.updateIngredientQuantities),
    );

    router.put(
        "/user-ingredients/:userId/history/:purchaseId",
        authenticateToken,
        asyncHandler(userIngredientsController.updatePurchaseQuantity),
    );

    router.get(
        "/user-ingredients/:userId/history/:ingredientId",
        authenticateToken,
        asyncHandler(userIngredientsController.getPurchaseHistory),
    );

    return router;
}
