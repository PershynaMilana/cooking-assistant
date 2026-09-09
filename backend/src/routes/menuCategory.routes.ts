import express, { type Router } from "express";

import { ROUTES } from "constants/routes";

import type MenuCategoryController from "controller/menuCategory.controller";
import optionalAuth from "middleware/optionalAuth";

export default function createMenuCategoryRouter(
    menuCategoryController: MenuCategoryController,
): Router {
    const router = express.Router();

    router.get(
        ROUTES.menuCategories.list,
        optionalAuth,
        menuCategoryController.getAll,
    );

    return router;
}
