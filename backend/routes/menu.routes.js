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

// getting all menus
router.get("/menu", authenticateToken, asyncHandler(getAllMenus));

// create menu+
router.post(
    "/create-menu",
    authenticateToken,
    asyncHandler(createMenuWithRecipes),
);

// delite menu by id
router.get("/menu/:id", authenticateToken, asyncHandler(getMenuWithRecipes));

// update menu
router.put("/menu/:id", authenticateToken, asyncHandler(updateMenu));

// delete menu
router.delete("/menu/:id", authenticateToken, asyncHandler(deleteMenu));

// getting menu by person
router.get(
    "/menu-filters-person/:id",
    authenticateToken,
    asyncHandler(searchPersonMenus),
);

module.exports = router;
