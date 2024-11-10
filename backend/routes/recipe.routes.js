const Router = require("express");
const router = new Router();
const recipeController = require("../controller/recipe.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

//? Створення рецепта
router.post("/recipe", authenticateToken, recipeController.createRecipe);

//? Отримання всіх рецептів
router.get("/recipes", authenticateToken, recipeController.getAllRecipes);

//? Отримання рецепта за ID
router.get("/recipe/:id", authenticateToken, recipeController.getRecipeWithIngredients);

//? Отримання всіх інгредієнтів
router.get("/ingredients", authenticateToken, recipeController.getAllIngredients);

//? Зміна рецепта за ID
router.put("/recipe/:id", authenticateToken, recipeController.updateRecipe);

//? Видалення рецепта за ID
router.delete("/recipe/:id", authenticateToken, recipeController.deleteRecipe);

//? Новий маршрут для фільтрації рецептів за типами та датами
router.get("/recipes-by-filters", authenticateToken, recipeController.searchRecipes);

//? Отримання статистики
router.get("/recipes-stats", authenticateToken, recipeController.getRecipesStats);

module.exports = router;
