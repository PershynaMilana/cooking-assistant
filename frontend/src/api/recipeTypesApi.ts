import type { RecipeTypesQuery, RecipeTypeSummary } from "types/recipeType";

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
