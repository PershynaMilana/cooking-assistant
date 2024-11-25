const express = require("express");
const MenuCategoryController = require("../controller/menuCategory.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

const router = express.Router();

// Получение всех категорий меню
router.get("/menu-categories", authenticateToken, MenuCategoryController.getAllMenuCategories);

// Получение категории меню по ID
// router.get("/menu-categories/:id", authenticateToken, MenuCategoryController.getMenuCategoryById);

// Получение меню по категориям
router.get("/menu", authenticateToken, MenuCategoryController.getMenusByCategories);

module.exports = router;
