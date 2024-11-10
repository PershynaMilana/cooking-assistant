const Router = require("express");
const router = new Router();
const typeController = require("../controller/type.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

//? Отримання всіх типів рецептів
router.get("/recipe-types", authenticateToken, typeController.getAllRecipeTypes);

//? Створення нового типу рецепта
router.post("/recipe-types", authenticateToken, typeController.createRecipeType);

//? Оновлення типу рецепта
router.put("/recipe-type/:id", authenticateToken, typeController.updateRecipeType);

//? Видалення типу рецепта
router.delete("/recipe-type/:id", authenticateToken, typeController.deleteRecipeType);

//? Отримання типу рецепта за ID
router.get("/recipe-type/:id", authenticateToken, typeController.getRecipeTypeById);

module.exports = router;
