import express, { type Router } from "express";

import type MenuCategoryController from "@controller/menuCategory.controller";
import asyncHandler from "@middleware/asyncHandler";
import authenticateToken from "@middleware/jwtMiddleware";

export default function createMenuCategoryRouter(
    menuCategoryController: MenuCategoryController,
): Router {
    const router = express.Router();

    // getting all menu categories
    router.get(
        "/menu-categories",
        authenticateToken,
        asyncHandler(menuCategoryController.getAll),
    );

    return router;
}
