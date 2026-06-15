import { apiClient } from "./client";
import { API_ROUTES } from "./endpoints";
import type { Ingredient } from "../types/ingredient";

export async function getIngredients(): Promise<Ingredient[]> {
    const response = await apiClient.get<Ingredient[]>(
        API_ROUTES.ingredients.list,
    );
    return response.data;
}
