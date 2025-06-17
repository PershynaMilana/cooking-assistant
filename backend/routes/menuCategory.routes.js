const express = require("express");
const MenuCategoryController = require("../controller/menuCategory.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

const router = express.Router();

//? Getting All menu categories
router.get(
  "/menu-categories",
  authenticateToken,
  MenuCategoryController.getAllMenuCategories
);

//? Gettin cat by id
// router.get("/menu-categories/:id", authenticateToken, MenuCategoryController.getMenuCategoryById);

//? Menu by cat
router.get(
  "/menu",
  authenticateToken,
  MenuCategoryController.getMenusByCategories
);

module.exports = router;
