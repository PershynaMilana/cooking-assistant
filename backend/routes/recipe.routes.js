const Router = require("express");
const router = new Router();
const recipeController = require("../controller/recipe.controller");

// Створення рецепта
router.post("/recipe", recipeController.createRecipe);

// Отримання всіх рецептів
router.get("/recipes", recipeController.getAllRecipes);

// Отримання рецепта за ID
router.get("/recipe/:id", recipeController.getRecipeWithIngredients);

// Отримання всіх інгредієнтів
router.get("/ingredients", recipeController.getAllIngredients);

// Зміна рецепта за ID
router.put("/recipe/:id", recipeController.updateRecipe);

// Видалення рецепта за ID
router.delete("/recipe/:id", recipeController.deleteRecipe);

// Отримання всіх типів рецептів
router.get("/recipe-types", recipeController.getAllRecipeTypes);

// Створення нового типу рецепта
router.post("/recipe-type", recipeController.createRecipeType);

// Оновлення типу рецепта
router.put("/recipe-type/:id", recipeController.updateRecipeType);

// Новий маршрут для фільтрації рецептів за типами і датами
router.get("/recipes-by-filters", recipeController.searchRecipes);

module.exports = router;
