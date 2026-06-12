import type { RequestHandler } from "express";

import type CreateMenu from "@application/use-cases/menus/CreateMenu";
import type DeleteMenu from "@application/use-cases/menus/DeleteMenu";
import type GetAllMenus from "@application/use-cases/menus/GetAllMenus";
import type GetMenuById from "@application/use-cases/menus/GetMenuById";
import type SearchPersonMenus from "@application/use-cases/menus/SearchPersonMenus";
import type UpdateMenu from "@application/use-cases/menus/UpdateMenu";
import { getUserId } from "./requestUser";

interface MenuControllerDependencies {
    getAllMenus: GetAllMenus;
    createMenu: CreateMenu;
    getMenuById: GetMenuById;
    updateMenu: UpdateMenu;
    deleteMenu: DeleteMenu;
    searchPersonMenus: SearchPersonMenus;
}

export default class MenuController {
    private getAllMenusUseCase: GetAllMenus;
    private createMenuUseCase: CreateMenu;
    private getMenuByIdUseCase: GetMenuById;
    private updateMenuUseCase: UpdateMenu;
    private deleteMenuUseCase: DeleteMenu;
    private searchPersonMenusUseCase: SearchPersonMenus;

    constructor({
        getAllMenus,
        createMenu,
        getMenuById,
        updateMenu,
        deleteMenu,
        searchPersonMenus,
    }: MenuControllerDependencies) {
        this.getAllMenusUseCase = getAllMenus;
        this.createMenuUseCase = createMenu;
        this.getMenuByIdUseCase = getMenuById;
        this.updateMenuUseCase = updateMenu;
        this.deleteMenuUseCase = deleteMenu;
        this.searchPersonMenusUseCase = searchPersonMenus;
    }

    getAll: RequestHandler = async (req, res) => {
        const menus = await this.getAllMenusUseCase.execute(req.query);
        res.status(200).json(menus);
    };

    create: RequestHandler = async (req, res) => {
        const { menuTitle, menuContent, categoryId, recipeIds } = req.body;
        const personId = getUserId(req);
        const menuId = await this.createMenuUseCase.execute({
            menuTitle,
            menuContent,
            categoryId,
            personId,
            recipeIds,
        });

        res.status(201).json({ message: "Menu created successfully", menuId });
    };

    getById: RequestHandler = async (req, res) => {
        const menu = await this.getMenuByIdUseCase.execute(
            req.params.id as string,
        );
        res.status(200).json(menu);
    };

    update: RequestHandler = async (req, res) => {
        const id = req.params.id as string;
        const personId = getUserId(req);
        const { menuTitle, menuContent, categoryId, recipeIds } = req.body;

        await this.updateMenuUseCase.execute(id, personId, {
            menuTitle,
            menuContent,
            categoryId,
            recipeIds,
        });

        res.status(200).json({ message: "Menu updated successfully" });
    };

    remove: RequestHandler = async (req, res) => {
        await this.deleteMenuUseCase.execute(
            req.params.id as string,
            getUserId(req),
        );
        res.status(200).json({ message: "Menu deleted successfully" });
    };

    searchByPerson: RequestHandler = async (req, res) => {
        const id = getUserId(req);
        const menus = await this.searchPersonMenusUseCase.execute(
            id,
            req.query,
        );
        res.status(200).json(menus);
    };
}
