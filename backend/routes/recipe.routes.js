const Router = require("express");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = (recipeController) => {
    const router = new Router();

    // creating recipe
    router.post(
        "/recipe",
        authenticateToken,
        asyncHandler(recipeController.createRecipe),
    );

    // get all recipes
    router.get(
        "/recipes",
        authenticateToken,
        asyncHandler(recipeController.getAllRecipes),
    );

    // get recipe by id
    router.get(
        "/recipe/:id",
        authenticateToken,
        asyncHandler(recipeController.getRecipeWithIngredients),
    );

    // get all ingredients
    router.get(
        "/ingredients",
        authenticateToken,
        asyncHandler(recipeController.getAllIngredients),
    );

    // updating recipe by id
    router.put(
        "/recipe/:id",
        authenticateToken,
        asyncHandler(recipeController.updateRecipe),
    );

    // del recipe by id
    router.delete(
        "/recipe/:id",
        authenticateToken,
        asyncHandler(recipeController.deleteRecipe),
    );

    // filter
    router.get(
        "/recipes-by-filters",
        authenticateToken,
        asyncHandler(recipeController.searchRecipes),
    );

    // filter by date, user
    router.get(
        "/recipes-filters-person/:id",
        authenticateToken,
        asyncHandler(recipeController.searchPersonRecipes),
    );

    // getting stats
    router.get(
        "/recipes-stats",
        authenticateToken,
        asyncHandler(recipeController.getRecipesStats),
    );

    return router;
};
