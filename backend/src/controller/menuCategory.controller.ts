import type { RequestHandler } from "express";

import type GetAllMenuCategories from "application/use-cases/menu-categories/GetAllMenuCategories";

interface MenuCategoryControllerDependencies {
    getAllMenuCategories: GetAllMenuCategories;
}

export default class MenuCategoryController {
    private getAllMenuCategoriesUseCase: GetAllMenuCategories;

    constructor({ getAllMenuCategories }: MenuCategoryControllerDependencies) {
        this.getAllMenuCategoriesUseCase = getAllMenuCategories;
    }

    getAll: RequestHandler = async (_req, res) => {
        const categories = await this.getAllMenuCategoriesUseCase.execute();

        res.status(200).json(categories);
    };
}
