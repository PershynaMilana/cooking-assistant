const Router = require("express");
const router = new Router();
const typeController = require("../controller/type.controller");

// Отримання всіх типів рецептів
router.get("/recipe-types", typeController.getAllRecipeTypes);

// Створення нового типу рецепта
router.post("/recipe-type", typeController.createRecipeType);

// Оновлення типу рецепта
router.put("/recipe-type/:id", typeController.updateRecipeType);

// Видалення типу рецепта
router.delete("/recipe-type/:id", typeController.deleteRecipeType);

router.post("/recipe-types", typeController.createRecipeType);

router.get("/recipe-type/:id", typeController.getRecipeTypeById);

module.exports = router;
