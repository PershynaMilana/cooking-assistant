const Router = require("express");
const router = new Router();
const typeController = require("../controller/type.controller");
const authenticateToken = require("../middleware/jwtMiddleware");

//? Get all recipe types
router.get("/recipe-types", authenticateToken, typeController.getAllRecipeTypes);

//? Create new recipe type
router.post("/recipe-types", authenticateToken, typeController.createRecipeType);

//? Update recipe type
router.put("/recipe-type/:id", authenticateToken, typeController.updateRecipeType);

//? Delete recipe type
router.delete("/recipe-type/:id", authenticateToken, typeController.deleteRecipeType);

//? Get recipe type by ID
router.get("/recipe-type/:id", authenticateToken, typeController.getRecipeTypeById);

module.exports = router;