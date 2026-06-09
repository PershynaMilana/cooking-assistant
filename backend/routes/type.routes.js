const Router = require("express");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = (recipeTypeController) => {
    const router = new Router();

    // get all recipe types
    router.get(
        "/recipe-types",
        authenticateToken,
        asyncHandler(recipeTypeController.getAll),
    );

    // create new recipe type
    router.post(
        "/recipe-types",
        authenticateToken,
        asyncHandler(recipeTypeController.create),
    );

    // update recipe type
    router.put(
        "/recipe-type/:id",
        authenticateToken,
        asyncHandler(recipeTypeController.update),
    );

    // delete recipe type
    router.delete(
        "/recipe-type/:id",
        authenticateToken,
        asyncHandler(recipeTypeController.remove),
    );

    // get recipe type by ID
    router.get(
        "/recipe-type/:id",
        authenticateToken,
        asyncHandler(recipeTypeController.getById),
    );

    return router;
};
