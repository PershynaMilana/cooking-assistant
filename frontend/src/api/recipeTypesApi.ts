import type {
    RecipeTypeFormData,
    RecipeTypesQuery,
    RecipeTypeSummary,
} from "types/recipeType";

import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";

export async function getRecipeTypes(
    params?: RecipeTypesQuery,
): Promise<RecipeTypeSummary[]> {
    const response = await apiClient.get<RecipeTypeSummary[]>(
        API_ROUTES.recipeTypes.list,
        { params },
    );

    return response.data;
}

export async function getRecipeTypeById(
    id: string,
): Promise<RecipeTypeFormData> {
    const response = await apiClient.get<RecipeTypeFormData>(
        API_ROUTES.recipeTypes.byId(id),
    );

    return response.data;
}

export async function createRecipeType(
    data: RecipeTypeFormData,
): Promise<void> {
    await apiClient.post(API_ROUTES.recipeTypes.list, data);
}

export async function updateRecipeType(
    id: string,
    data: RecipeTypeFormData,
): Promise<void> {
    await apiClient.put(API_ROUTES.recipeTypes.byId(id), data);
}

export async function deleteRecipeType(id: number): Promise<void> {
    await apiClient.delete(API_ROUTES.recipeTypes.byId(id));
}
