import express, { type Router } from "express";

import type MenuCategoryController from "@controller/menuCategory.controller";
import authenticateToken from "@middleware/jwtMiddleware";

export default function createMenuCategoryRouter(
    menuCategoryController: MenuCategoryController,
): Router {
    const router = express.Router();

    router.get(
        "/menu-categories",
        authenticateToken,
        menuCategoryController.getAll,
    );

    return router;
}
