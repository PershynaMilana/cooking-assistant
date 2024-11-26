const express = require("express");
const { getAllMenus, createMenuWithRecipes, getMenuWithRecipes, deleteMenu, updateMenu, searchPersonMenus } = require("../controller/menu.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

const router = express.Router();

//? Отримання всіх меню
router.get("/menu", authenticateToken, getAllMenus);

//? Створення меню
router.post("/create-menu", authenticateToken, createMenuWithRecipes);

//? Отримання меню по ID
router.get("/menu/:id", authenticateToken, getMenuWithRecipes);

//? Оновлення меню
router.put("/menu/:id", authenticateToken, updateMenu);

//? Видалення меню
router.delete("/menu/:id", authenticateToken, deleteMenu);

//? Отримання меню користувача
router.get("/menu-filters-person/:id", authenticateToken, searchPersonMenus);

module.exports = router;