import express, { type Router } from "express";

import type RecipeController from "@controller/recipe.controller";
import authenticateToken from "@middleware/jwtMiddleware";

export default function createRecipeRouter(
    recipeController: RecipeController,
): Router {
    const router = express.Router();

    // creating recipe
    router.post("/recipe", authenticateToken, recipeController.createRecipe);

    // get all recipes
    router.get("/recipes", authenticateToken, recipeController.getAllRecipes);

    // get recipe by id
    router.get(
        "/recipe/:id",
        authenticateToken,
        recipeController.getRecipeWithIngredients,
    );

    // get all ingredients
    router.get(
        "/ingredients",
        authenticateToken,
        recipeController.getAllIngredients,
    );

    // updating recipe by id
    router.put("/recipe/:id", authenticateToken, recipeController.updateRecipe);

    // del recipe by id
    router.delete(
        "/recipe/:id",
        authenticateToken,
        recipeController.deleteRecipe,
    );

    // filter
    router.get(
        "/recipes-by-filters",
        authenticateToken,
        recipeController.searchRecipes,
    );

    // filter by date for the authenticated user
    router.get(
        "/recipes-filters-person",
        authenticateToken,
        recipeController.searchPersonRecipes,
    );

    // getting stats
    router.get(
        "/recipes-stats",
        authenticateToken,
        recipeController.getRecipesStats,
    );

    return router;
}
