const Router = require("express");
const router = new Router();
const typeController = require("../controller/type.controller");
const authenticateToken = require("../middleware/jwtMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

//? Get all recipe types
router.get(
    "/recipe-types",
    authenticateToken,
    asyncHandler(typeController.getAllRecipeTypes),
);

//? Create new recipe type
router.post(
    "/recipe-types",
    authenticateToken,
    asyncHandler(typeController.createRecipeType),
);

//? Update recipe type
router.put(
    "/recipe-type/:id",
    authenticateToken,
    asyncHandler(typeController.updateRecipeType),
);

//? Delete recipe type
router.delete(
    "/recipe-type/:id",
    authenticateToken,
    asyncHandler(typeController.deleteRecipeType),
);

//? Get recipe type by ID
router.get(
    "/recipe-type/:id",
    authenticateToken,
    asyncHandler(typeController.getRecipeTypeById),
);

module.exports = router;
