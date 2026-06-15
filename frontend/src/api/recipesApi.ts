import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";
import type {
    RecipeListItem,
    RecipeDetails,
    RecipeFilterParams,
    CreateRecipeRequest,
    UpdateRecipeRequest,
} from "../types/recipe";

export async function getRecipesByFilters(
    params: RecipeFilterParams,
): Promise<RecipeListItem[]> {
    const response = await apiClient.get<RecipeListItem[]>(
        API_ROUTES.recipes.byFilters,
        { params },
    );
    return response.data;
}

export async function getRecipesByPerson(
    userId: number,
    params: RecipeFilterParams,
): Promise<RecipeListItem[]> {
    const response = await apiClient.get<RecipeListItem[]>(
        API_ROUTES.recipes.byPerson(userId),
        { params },
    );
    return response.data;
}

export async function getRecipeById(id: string): Promise<RecipeDetails> {
    const response = await apiClient.get<RecipeDetails>(
        API_ROUTES.recipes.byId(id),
    );
    return response.data;
}

export async function createRecipe(data: CreateRecipeRequest): Promise<void> {
    await apiClient.post(API_ROUTES.recipes.create, data);
}

export async function updateRecipe(
    id: string,
    data: UpdateRecipeRequest,
): Promise<void> {
    await apiClient.put(API_ROUTES.recipes.byId(id), data);
}

export async function deleteRecipe(id: string): Promise<void> {
    await apiClient.delete(API_ROUTES.recipes.byId(id));
}
