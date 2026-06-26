import type { RecipeFilterParams } from "types/recipe";

import type { RecipeFiltersState } from "redux/slices/filtersSlice";

// merges the stored recipe filters with the URL-sourced ingredient search into
// the query params the recipes endpoints expect
export const buildRecipeFilterParams = (
    filters: RecipeFiltersState,
    ingredientName: string | null,
): RecipeFilterParams => ({
    ingredient_name: ingredientName ?? "",
    sort_order: filters.sortOrder,
    type_ids:
        filters.selectedTypes.length > 0
            ? filters.selectedTypes.join(",")
            : undefined,
    start_date: filters.startDate || undefined,
    end_date: filters.endDate || undefined,
    min_cooking_time: filters.minCookingTime || undefined,
    max_cooking_time: filters.maxCookingTime || undefined,
});
