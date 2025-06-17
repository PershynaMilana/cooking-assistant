const Router = require("express");
const router = new Router();
const userIngredientsController = require("../controller/userIngredients.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

//? Get user ingredients
router.get(
  "/user-ingredients/:id",
  authenticateToken,
  userIngredientsController.getUserIngredients
);

//? Update user ingredients
router.put(
  "/user-ingredients/:id",
  authenticateToken,
  userIngredientsController.updateUserIngredients
);

//? Delete ingredient for specific user
router.delete(
  "/user-ingredients/:userId/:ingredientId",
  authenticateToken,
  userIngredientsController.deleteUserIngredient
);

//? Update ingredient quantities
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