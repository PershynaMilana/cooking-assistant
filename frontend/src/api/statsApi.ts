import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";
import type { RecipesStatsResponse } from "../types/stats";

export async function getRecipesStats(): Promise<RecipesStatsResponse> {
    const response = await apiClient.get<RecipesStatsResponse>(
        API_ROUTES.recipes.stats,
    );
    return response.data;
}
