// userIngredients.routes.js
const Router = require("express");
const router = new Router();
const userIngredientsController = require("../controller/userIngredients.controller");

// Отримати інгредієнти користувача
router.get("/user-ingredients", userIngredientsController.getUserIngredients);

// Оновити інгредієнти користувача
router.put(
  "/user-ingredients",
  userIngredientsController.updateUserIngredients
);

module.exports = router;

//TODO: finish this later, using userID