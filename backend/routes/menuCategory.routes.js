const express = require("express");
const MenuCategoryController = require("../controller/menuCategory.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

const router = express.Router();

//? Отримання всіх категорій меню
router.get("/menu-categories", authenticateToken, MenuCategoryController.getAllMenuCategories);

//? Отримання категорій меню за ID
// router.get("/menu-categories/:id", authenticateToken, MenuCategoryController.getMenuCategoryById);

//? Отримання меню за категорією
router.get("/menu", authenticateToken, MenuCategoryController.getMenusByCategories);

module.exports = router;
