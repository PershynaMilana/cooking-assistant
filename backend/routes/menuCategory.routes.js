const express = require("express");
const MenuCategoryController = require("../controller/menuCategory.controller");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

//? Getting All menu categories
router.get(
    "/menu-categories",
    authenticateToken,
    asyncHandler(MenuCategoryController.getAllMenuCategories),
);

//? Gettin cat by id
// router.get("/menu-categories/:id", authenticateToken, MenuCategoryController.getMenuCategoryById);

//? Menu by cat
router.get(
    "/menu",
    authenticateToken,
    asyncHandler(MenuCategoryController.getMenusByCategories),
);

module.exports = router;
