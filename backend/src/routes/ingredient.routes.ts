import express, { type Router } from "express";

import { ROUTES } from "constants/routes";

import type IngredientController from "controller/ingredient.controller";
import optionalAuth from "middleware/optionalAuth";

export default function createIngredientRouter(
    ingredientController: IngredientController,
): Router {
    const router = express.Router();

    router.get(
        ROUTES.ingredients.list,
        optionalAuth,
        ingredientController.getAll,
    );

    return router;
}
