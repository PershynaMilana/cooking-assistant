const express = require("express");
const {
  getAllMenus,
  createMenuWithRecipes,
  getMenuWithRecipes,
  deleteMenu,
  updateMenu,
  searchPersonMenus,
} = require("../controller/menu.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

const router = express.Router();

//? Getting all menus
router.get("/menu", authenticateToken, getAllMenus);

//? Create menu+
router.post("/create-menu", authenticateToken, createMenuWithRecipes);

//? Delite menu by id
router.get("/menu/:id", authenticateToken, getMenuWithRecipes);

//? Update menu
router.put("/menu/:id", authenticateToken, updateMenu);

//? Delete menu
router.delete("/menu/:id", authenticateToken, deleteMenu);

//? Getting Menu by person
router.get("/menu-filters-person/:id", authenticateToken, searchPersonMenus);

module.exports = router;
