import type { RequestHandler } from "express";

import type CreateRecipe from "../application/use-cases/recipes/CreateRecipe";
import type DeleteRecipe from "../application/use-cases/recipes/DeleteRecipe";
import type GetAllIngredients from "../application/use-cases/recipes/GetAllIngredients";
import type GetAllRecipes from "../application/use-cases/recipes/GetAllRecipes";
import type GetRecipeById from "../application/use-cases/recipes/GetRecipeById";
import type GetRecipeStats from "../application/use-cases/recipes/GetRecipeStats";
import type SearchPersonRecipes from "../application/use-cases/recipes/SearchPersonRecipes";
import type SearchRecipes from "../application/use-cases/recipes/SearchRecipes";
import type UpdateRecipe from "../application/use-cases/recipes/UpdateRecipe";
import type { RecipeFilters } from "../application/use-cases/recipes/recipe.types";
import { getUserId } from "./requestUser";

interface RecipeControllerDependencies {
    createRecipe: CreateRecipe;
    getAllRecipes: GetAllRecipes;
    getRecipeById: GetRecipeById;
    updateRecipe: UpdateRecipe;
    deleteRecipe: DeleteRecipe;
    searchRecipes: SearchRecipes;
    searchPersonRecipes: SearchPersonRecipes;
    getRecipeStats: GetRecipeStats;
    getAllIngredients: GetAllIngredients;
}

export default class RecipeController {
    private createRecipeUseCase: CreateRecipe;
    private getAllRecipesUseCase: GetAllRecipes;
    private getRecipeByIdUseCase: GetRecipeById;
    private updateRecipeUseCase: UpdateRecipe;
    private deleteRecipeUseCase: DeleteRecipe;
    private searchRecipesUseCase: SearchRecipes;
    private searchPersonRecipesUseCase: SearchPersonRecipes;
    private getRecipeStatsUseCase: GetRecipeStats;
    private getAllIngredientsUseCase: GetAllIngredients;

    constructor({
        createRecipe,
        getAllRecipes,
        getRecipeById,
        updateRecipe,
        deleteRecipe,
        searchRecipes,
        searchPersonRecipes,
        getRecipeStats,
        getAllIngredients,
    }: RecipeControllerDependencies) {
        this.createRecipeUseCase = createRecipe;
        this.getAllRecipesUseCase = getAllRecipes;
        this.getRecipeByIdUseCase = getRecipeById;
        this.updateRecipeUseCase = updateRecipe;
        this.deleteRecipeUseCase = deleteRecipe;
        this.searchRecipesUseCase = searchRecipes;
        this.searchPersonRecipesUseCase = searchPersonRecipes;
        this.getRecipeStatsUseCase = getRecipeStats;
        this.getAllIngredientsUseCase = getAllIngredients;
    }

    createRecipe: RequestHandler = async (req, res) => {
        const { title, content, ingredients, type_id, cooking_time, servings } =
            req.body;
        const person_id = getUserId(req);

        const created = await this.createRecipeUseCase.execute({
            title,
            content,
            person_id,
            ingredients,
            type_id,
            cooking_time,
            servings,
        });

        res.json(created);
    };

    getAllRecipes: RequestHandler = async (_req, res) => {
        const recipes = await this.getAllRecipesUseCase.execute();
        res.json(recipes);
    };

    getRecipeWithIngredients: RequestHandler = async (req, res) => {
        const recipe = await this.getRecipeByIdUseCase.execute(
            req.params.id as string,
        );
        res.json(recipe);
    };

    updateRecipe: RequestHandler = async (req, res) => {
        const recipeId = req.params.id as string;
        const {
            title,
            content,
            ingredients: newIngredients,
            type_id,
            cooking_time,
            servings,
        } = req.body;

        const updated = await this.updateRecipeUseCase.execute(recipeId, {
            title,
            content,
            ingredients: newIngredients,
            type_id,
            cooking_time,
            servings,
        });

        res.json(updated);
    };

    searchRecipes: RequestHandler = async (req, res) => {
        const recipes = await this.searchRecipesUseCase.execute(
            req.query as RecipeFilters,
        );
        res.json(recipes);
    };

    searchPersonRecipes: RequestHandler = async (req, res) => {
        const person_id = getUserId(req);
        const recipes = await this.searchPersonRecipesUseCase.execute(
            person_id,
            req.query as RecipeFilters,
        );

        res.json(recipes);
    };

    deleteRecipe: RequestHandler = async (req, res) => {
        await this.deleteRecipeUseCase.execute(req.params.id as string);
        res.json({ message: "Recipe successfully deleted" });
    };

    getAllIngredients: RequestHandler = async (_req, res) => {
        const ingredients = await this.getAllIngredientsUseCase.execute();
        res.json(ingredients);
    };

    getRecipesStats: RequestHandler = async (_req, res) => {
        const stats = await this.getRecipeStatsUseCase.execute();
        res.json(stats);
    };
}
