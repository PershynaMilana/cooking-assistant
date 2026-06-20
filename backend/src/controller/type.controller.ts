import type { RequestHandler } from "express";

import type GetAllRecipeTypes from "@application/use-cases/recipe-types/GetAllRecipeTypes";

interface RecipeTypeControllerDependencies {
    getAllRecipeTypes: GetAllRecipeTypes;
}

export default class RecipeTypeController {
    private getAllRecipeTypesUseCase: GetAllRecipeTypes;

    constructor({ getAllRecipeTypes }: RecipeTypeControllerDependencies) {
        this.getAllRecipeTypesUseCase = getAllRecipeTypes;
    }

    getAll: RequestHandler = async (_req, res) => {
        const types = await this.getAllRecipeTypesUseCase.execute();
        res.json(types);
    };
}
