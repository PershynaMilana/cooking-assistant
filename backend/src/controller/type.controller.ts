import type { RequestHandler } from "express";

import type CreateRecipeType from "@application/use-cases/recipe-types/CreateRecipeType";
import type DeleteRecipeType from "@application/use-cases/recipe-types/DeleteRecipeType";
import type GetAllRecipeTypes from "@application/use-cases/recipe-types/GetAllRecipeTypes";
import type GetRecipeTypeById from "@application/use-cases/recipe-types/GetRecipeTypeById";
import type UpdateRecipeType from "@application/use-cases/recipe-types/UpdateRecipeType";

interface RecipeTypeControllerDependencies {
    getAllRecipeTypes: GetAllRecipeTypes;
    getRecipeTypeById: GetRecipeTypeById;
    createRecipeType: CreateRecipeType;
    updateRecipeType: UpdateRecipeType;
    deleteRecipeType: DeleteRecipeType;
}

export default class RecipeTypeController {
    private getAllRecipeTypesUseCase: GetAllRecipeTypes;
    private getRecipeTypeByIdUseCase: GetRecipeTypeById;
    private createRecipeTypeUseCase: CreateRecipeType;
    private updateRecipeTypeUseCase: UpdateRecipeType;
    private deleteRecipeTypeUseCase: DeleteRecipeType;

    constructor({
        getAllRecipeTypes,
        getRecipeTypeById,
        createRecipeType,
        updateRecipeType,
        deleteRecipeType,
    }: RecipeTypeControllerDependencies) {
        this.getAllRecipeTypesUseCase = getAllRecipeTypes;
        this.getRecipeTypeByIdUseCase = getRecipeTypeById;
        this.createRecipeTypeUseCase = createRecipeType;
        this.updateRecipeTypeUseCase = updateRecipeType;
        this.deleteRecipeTypeUseCase = deleteRecipeType;
    }

    getAll: RequestHandler = async (_req, res) => {
        const types = await this.getAllRecipeTypesUseCase.execute();
        res.json(types);
    };

    getById: RequestHandler = async (req, res) => {
        const type = await this.getRecipeTypeByIdUseCase.execute(
            req.params.id as string,
        );
        res.json(type);
    };

    create: RequestHandler = async (req, res) => {
        const { type_name, description } = req.body;
        const created = await this.createRecipeTypeUseCase.execute({
            type_name,
            description,
        });
        res.json(created);
    };

    update: RequestHandler = async (req, res) => {
        const { type_name, description } = req.body;
        const updated = await this.updateRecipeTypeUseCase.execute(
            req.params.id as string,
            {
                type_name,
                description,
            },
        );
        res.json(updated);
    };

    remove: RequestHandler = async (req, res) => {
        await this.deleteRecipeTypeUseCase.execute(req.params.id as string);
        res.json({
            message: "Recipe type and all related recipes successfully deleted",
        });
    };
}
