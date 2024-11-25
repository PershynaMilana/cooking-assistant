const express = require("express");
const { getAllMenus, createMenuWithRecipes, getMenuWithRecipes, deleteMenu } = require("../controller/menu.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

const router = express.Router();

// Роут для получения всех меню
router.get("/menu", authenticateToken, getAllMenus);

// Роут для создания нового меню
router.post("/create-menu", authenticateToken, createMenuWithRecipes);

// Роут для получения меню по ID с рецептами
router.get("/menu/:id", authenticateToken, getMenuWithRecipes);


// Роут для удаления меню
router.delete("/menu/:id", authenticateToken, deleteMenu);

module.exports = router;
