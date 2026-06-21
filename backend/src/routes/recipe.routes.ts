import express, { type Router } from "express";

import type RecipeController from "controller/recipe.controller";
import authenticateToken from "middleware/jwtMiddleware";

export default function createRecipeRouter(
    recipeController: RecipeController,
): Router {
    const router = express.Router();

    router.post("/recipe", authenticateToken, recipeController.createRecipe);

    router.get("/recipes", authenticateToken, recipeController.getAllRecipes);

    router.get(
        "/recipe/:id",
        authenticateToken,
        recipeController.getRecipeWithIngredients,
    );

    router.get(
        "/ingredients",
        authenticateToken,
        recipeController.getAllIngredients,
    );

    router.put("/recipe/:id", authenticateToken, recipeController.updateRecipe);

    router.delete(
        "/recipe/:id",
        authenticateToken,
        recipeController.deleteRecipe,
    );

    router.get(
        "/recipes-by-filters",
        authenticateToken,
        recipeController.searchRecipes,
    );

    router.get(
        "/recipes-filters-person",
        authenticateToken,
        recipeController.searchPersonRecipes,
    );

    router.get(
        "/recipes-stats",
        authenticateToken,
        recipeController.getRecipesStats,
    );

    return router;
}
