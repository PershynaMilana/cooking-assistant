const express = require("express");
const MenuCategoryController = require("../controller/menuCategory.controller");

const router = express.Router();

// Получение всех категорий меню
router.get("/menu-categories", MenuCategoryController.getAllMenuCategories);

// Получение категории меню по ID
// router.get("/menu-categories/:id", MenuCategoryController.getMenuCategoryById);

// Получение меню по категориям
router.get("/menu", MenuCategoryController.getMenusByCategories);

module.exports = router;
