const Router = require("express");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = (userController) => {
    const router = new Router();

    // registration
    router.post("/register", asyncHandler(userController.registerUser));

    // login
    router.post("/login", asyncHandler(userController.loginUser));

    // get users
    router.get(
        "/user",
        authenticateToken,
        asyncHandler(userController.getUsers),
    );

    return router;
};
