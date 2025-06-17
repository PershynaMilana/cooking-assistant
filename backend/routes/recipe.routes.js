const Router = require("express");
const router = new Router();
const recipeController = require("../controller/recipe.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

//? Creating recipe
router.post("/recipe", authenticateToken, recipeController.createRecipe);

//? Get all recipes
router.get("/recipes", authenticateToken, recipeController.getAllRecipes);

//? Get recipe by id
router.get("/recipe/:id", authenticateToken, recipeController.getRecipeWithIngredients);

//? Get all ingredients
router.get("/ingredients", authenticateToken, recipeController.getAllIngredients);

//? Updating recipe by id
router.put("/recipe/:id", authenticateToken, recipeController.updateRecipe);

//? del recipe by id
router.delete("/recipe/:id", authenticateToken, recipeController.deleteRecipe);

//? filter
router.get("/recipes-by-filters", authenticateToken, recipeController.searchRecipes);

//? filter by date, user
router.get("/recipes-filters-person/:id", authenticateToken, recipeController.searchPersonRecipes);

//? getting stats
router.get("/recipes-stats", authenticateToken, recipeController.getRecipesStats);

module.exports = router;
