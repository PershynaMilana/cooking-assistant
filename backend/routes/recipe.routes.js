const Router = require("express");
const router = new Router();
const recipeController = require("../controller/recipe.controller");

// Создание рецепта
router.post("/recipe", recipeController.createRecipe);

// Получение всех рецептов
router.get("/recipes", recipeController.getAllRecipes);

// Получение рецепта по ID
router.get("/recipe/:id", recipeController.getRecipeWithIngredients);

// Получение всех ингредиентов
router.get("/ingredients", recipeController.getAllIngredients);

// Изменение рецепта по ID
router.put("/recipe/:id", recipeController.updateRecipe);

// Удаление рецепта по ID
router.delete("/recipe/:id", recipeController.deleteRecipe);

// Получение всех типов рецептов
router.get("/recipe-types", recipeController.getAllRecipeTypes);

// Создание нового типа рецепта
router.post("/recipe-type", recipeController.createRecipeType);

// Обновление типа рецепта
router.put("/recipe-type/:id", recipeController.updateRecipeType);

// Получение рецептов по типу
// router.get("/recipes-by-type", recipeController.getRecipesByType);

// Новый маршрут для фильтрации рецептов по типам и датам
router.get("/recipes-by-filters", recipeController.searchRecipes);

module.exports = router;
