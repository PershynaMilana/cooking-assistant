import express, { type Router } from "express";

import type MenuController from "@controller/menu.controller";
import authenticateToken from "@middleware/jwtMiddleware";

export default function createMenuRouter(
    menuController: MenuController,
): Router {
    const router = express.Router();

    // getting all menus
    router.get("/menu", authenticateToken, menuController.getAll);

    // create menu+
    router.post("/create-menu", authenticateToken, menuController.create);

    // delite menu by id
    router.get("/menu/:id", authenticateToken, menuController.getById);

    // update menu
    router.put("/menu/:id", authenticateToken, menuController.update);

    // delete menu
    router.delete("/menu/:id", authenticateToken, menuController.remove);

    // getting menus for the authenticated user
    router.get(
        "/menu-filters-person",
        authenticateToken,
        menuController.searchByPerson,
    );

    return router;
}
