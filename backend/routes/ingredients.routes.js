
const Router = require("express");
const router = new Router();
const ingredientsController = require("../controller/ingredients.controller");

router.get(
  "/selected-ingredients",
  ingredientsController.getSelectedIngredients
);
router.put("/ingredients", ingredientsController.updateSelectedIngredients);
router.delete(
  "/selected-ingredients/:id",
  ingredientsController.deleteSelectedIngredient
);

module.exports = router;
