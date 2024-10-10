const Router = require("express");
const router = new Router();
const recipeController = require("../controller/recipe.controller");

// Создание рецепта
router.post("/recipe", recipeController.createRecipe);

// Получение всех рецептов
router.get("/recipes", recipeController.getAllRecipes);

// Получение рецепта по ID
router.get("/recipe/:id", recipeController.getRecipeWithIngredients);

// Поиск рецептов по ингредиенту
// router.get("/recipes-by-ingredient", recipeController.getRecipesByIngredient);

// Поиск рецептов по имени ингредиента
router.get(
  "/recipes-by-ingredient-name",
  recipeController.getRecipesByIngredientName
);

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

//router.get("/recipe", recipeController.getRecipesByPerson);

router.get("/recipes-by-type", recipeController.getRecipesByType);

module.exports = router;
