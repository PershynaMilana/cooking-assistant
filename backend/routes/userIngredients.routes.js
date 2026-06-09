const Router = require("express");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = (userIngredientsController) => {
    const router = new Router();

    // get user ingredients
    router.get(
        "/user-ingredients/:id",
        authenticateToken,
        asyncHandler(userIngredientsController.getUserIngredients),
    );

    // update user ingredients
    router.put(
        "/user-ingredients/:id",
        authenticateToken,
        asyncHandler(userIngredientsController.updateUserIngredients),
    );

    // delete ingredient for specific user
    router.delete(
        "/user-ingredients/:userId/:ingredientId",
        authenticateToken,
        asyncHandler(userIngredientsController.deleteUserIngredient),
    );

    // update ingredient quantities
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

    return router;
};
