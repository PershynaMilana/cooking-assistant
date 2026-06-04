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
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

//? Getting all menus
router.get("/menu", authenticateToken, asyncHandler(getAllMenus));

//? Create menu+
router.post(
    "/create-menu",
    authenticateToken,
    asyncHandler(createMenuWithRecipes),
);

//? Delite menu by id
router.get("/menu/:id", authenticateToken, asyncHandler(getMenuWithRecipes));

//? Update menu
router.put("/menu/:id", authenticateToken, asyncHandler(updateMenu));

//? Delete menu
router.delete("/menu/:id", authenticateToken, asyncHandler(deleteMenu));

//? Getting Menu by person
router.get(
    "/menu-filters-person/:id",
    authenticateToken,
    asyncHandler(searchPersonMenus),
);

module.exports = router;
