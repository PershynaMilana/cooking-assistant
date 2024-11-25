const Router = require("express");
const router = new Router();
const userIngredientsController = require("../controller/userIngredients.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

//? Отримати інгредієнти користувача
router.get(
    "/user-ingredients/:id",
    authenticateToken,
    userIngredientsController.getUserIngredients
);

//? Оновити інгредієнти користувача
router.put(
    "/user-ingredients/:id",
    authenticateToken,
    userIngredientsController.updateUserIngredients
);

//? Видалити інгредієнт у конкретного користувача
router.delete(
    "/user-ingredients/:userId/:ingredientId",
    authenticateToken,
    userIngredientsController.deleteUserIngredient
);

//? Оновити кількість інгредієнтів
router.put(
    "/user-ingredients/update-quantities/:userId",
    authenticateToken,
    userIngredientsController.updateIngredientQuantities
);

module.exports = router;
