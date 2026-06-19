import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { SEARCH_PARAM_INGREDIENT_NAME } from "constants/queryParams";
import type { RecipeFilterParams } from "types/recipe";

export interface RecipeFilterState {
    selectedTypes: number[];
    startDate: string;
    endDate: string;
    minCookingTime: string;
    maxCookingTime: string;
    sortOrder: string;
    ingredientName: string | null;
}

export const useRecipeFilters = () => {
    const [searchParams] = useSearchParams();
    const ingredientName = searchParams.get(SEARCH_PARAM_INGREDIENT_NAME);

    const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minCookingTime, setMinCookingTime] = useState("");
    const [maxCookingTime, setMaxCookingTime] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const buildFilterParams = useCallback((): RecipeFilterParams => {
        return {
            ingredient_name: ingredientName ?? "",
            sort_order: sortOrder,
            type_ids:
                selectedTypes.length > 0 ? selectedTypes.join(",") : undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            min_cooking_time: minCookingTime || undefined,
            max_cooking_time: maxCookingTime || undefined,
        };
    }, [
        ingredientName,
        sortOrder,
        selectedTypes,
        startDate,
        endDate,
        minCookingTime,
        maxCookingTime,
    ]);

    return {
        filters: {
            selectedTypes,
            startDate,
            endDate,
            minCookingTime,
            maxCookingTime,
            sortOrder,
            ingredientName,
        } satisfies RecipeFilterState,
        setSelectedTypes,
        setStartDate,
        setEndDate,
        setMinCookingTime,
        setMaxCookingTime,
        setSortOrder,
        buildFilterParams,
    };
};
