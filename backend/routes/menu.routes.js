const express = require("express");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = (menuController) => {
    const router = express.Router();

    // getting all menus
    router.get("/menu", authenticateToken, asyncHandler(menuController.getAll));

    // create menu+
    router.post(
        "/create-menu",
        authenticateToken,
        asyncHandler(menuController.create),
    );

    // delite menu by id
    router.get(
        "/menu/:id",
        authenticateToken,
        asyncHandler(menuController.getById),
    );

    // update menu
    router.put(
        "/menu/:id",
        authenticateToken,
        asyncHandler(menuController.update),
    );

    // delete menu
    router.delete(
        "/menu/:id",
        authenticateToken,
        asyncHandler(menuController.remove),
    );

    // getting menu by person
    router.get(
        "/menu-filters-person/:id",
        authenticateToken,
        asyncHandler(menuController.searchByPerson),
    );

    return router;
};
