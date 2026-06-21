import express, { type Router } from "express";

import type RecipeTypeController from "controller/type.controller";
import authenticateToken from "middleware/jwtMiddleware";

export default function createTypeRouter(
    recipeTypeController: RecipeTypeController,
): Router {
    const router = express.Router();

    router.get("/recipe-types", authenticateToken, recipeTypeController.getAll);

    return router;
}
