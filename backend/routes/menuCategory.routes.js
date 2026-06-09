const express = require("express");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = (menuCategoryController) => {
    const router = express.Router();

    // getting all menu categories
    router.get(
        "/menu-categories",
        authenticateToken,
        asyncHandler(menuCategoryController.getAll),
    );

    return router;
};
