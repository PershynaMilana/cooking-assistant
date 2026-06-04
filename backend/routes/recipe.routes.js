const Router = require("express");
const router = new Router();
const recipeController = require("../controller/recipe.controller");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

//? Creating recipe
router.post(
    "/recipe",
    authenticateToken,
    asyncHandler(recipeController.createRecipe),
);

//? Get all recipes
router.get(
    "/recipes",
    authenticateToken,
    asyncHandler(recipeController.getAllRecipes),
);

//? Get recipe by id
router.get(
    "/recipe/:id",
    authenticateToken,
    asyncHandler(recipeController.getRecipeWithIngredients),
);

//? Get all ingredients
router.get(
    "/ingredients",
    authenticateToken,
    asyncHandler(recipeController.getAllIngredients),
);

//? Updating recipe by id
router.put(
    "/recipe/:id",
    authenticateToken,
    asyncHandler(recipeController.updateRecipe),
);

//? del recipe by id
router.delete(
    "/recipe/:id",
    authenticateToken,
    asyncHandler(recipeController.deleteRecipe),
);

//? filter
router.get(
    "/recipes-by-filters",
    authenticateToken,
    asyncHandler(recipeController.searchRecipes),
);

//? filter by date, user
router.get(
    "/recipes-filters-person/:id",
    authenticateToken,
    asyncHandler(recipeController.searchPersonRecipes),
);

//? getting stats
router.get(
    "/recipes-stats",
    authenticateToken,
    asyncHandler(recipeController.getRecipesStats),
);

module.exports = router;
