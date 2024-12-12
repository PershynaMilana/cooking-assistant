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

router.put(
    "/user-ingredients/:userId/history/:purchaseId",
    authenticateToken,
    userIngredientsController.updatePurchaseQuantity
);

router.get(
  "/user-ingredients/:userId/history/:ingredientId",
  authenticateToken,
  userIngredientsController.getPurchaseHistory
);

module.exports = router;
