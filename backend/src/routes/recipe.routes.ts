import express, { type Router } from "express";

import { ROUTES } from "constants/routes";

import type RecipeController from "controller/recipe.controller";
import authenticateToken from "middleware/jwtMiddleware";
import optionalAuth from "middleware/optionalAuth";

export default function createRecipeRouter(
    recipeController: RecipeController,
): Router {
    const router = express.Router();

    router.post(
        ROUTES.recipes.create,
        authenticateToken,
        recipeController.createRecipe,
    );

    router.get(
        ROUTES.recipes.list,
        authenticateToken,
        recipeController.getAllRecipes,
    );

    router.get(
        ROUTES.recipes.byId,
        optionalAuth,
        recipeController.getRecipeWithIngredients,
    );

    router.put(
        ROUTES.recipes.byId,
        authenticateToken,
        recipeController.updateRecipe,
    );

    router.delete(
        ROUTES.recipes.byId,
        authenticateToken,
        recipeController.deleteRecipe,
    );

    router.get(
        ROUTES.recipes.byFilters,
        optionalAuth,
        recipeController.searchRecipes,
    );

    router.get(
        ROUTES.recipes.byPerson,
        authenticateToken,
        recipeController.searchPersonRecipes,
    );

    router.get(
        ROUTES.recipes.stats,
        authenticateToken,
        recipeController.getRecipesStats,
    );

    return router;
}
