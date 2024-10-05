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
router.get("/recipes-by-ingredient", recipeController.getRecipesByIngredient);

router.get(
  "/recipes-by-ingredient-name",
  recipeController.getRecipesByIngredientName
);

router.get("/ingredients", recipeController.getAllIngredients);

// Изменение рецепта по ID
router.put("/recipe/:id", recipeController.updateRecipe);

// Удаление рецепта по ID
router.delete("/recipe/:id", recipeController.deleteRecipe);

//router.get("/recipe", recipeController.getRecipesByPerson);

module.exports = router;
