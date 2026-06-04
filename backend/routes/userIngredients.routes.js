const Router = require("express");
const router = new Router();
const userIngredientsController = require("../controller/userIngredients.controller");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

//? Get user ingredients
router.get(
    "/user-ingredients/:id",
    authenticateToken,
    asyncHandler(userIngredientsController.getUserIngredients),
);

//? Update user ingredients
router.put(
    "/user-ingredients/:id",
    authenticateToken,
    asyncHandler(userIngredientsController.updateUserIngredients),
);

//? Delete ingredient for specific user
router.delete(
    "/user-ingredients/:userId/:ingredientId",
    authenticateToken,
    asyncHandler(userIngredientsController.deleteUserIngredient),
);

//? Update ingredient quantities
router.put(
    "/user-ingredients/update-quantities/:userId",
    authenticateToken,
    asyncHandler(userIngredientsController.updateIngredientQuantities),
);

router.put(
    "/user-ingredients/:userId/history/:purchaseId",
    authenticateToken,
    asyncHandler(userIngredientsController.updatePurchaseQuantity),
);

router.get(
    "/user-ingredients/:userId/history/:ingredientId",
    authenticateToken,
    asyncHandler(userIngredientsController.getPurchaseHistory),
);

module.exports = router;
