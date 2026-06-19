import { useCallback, useEffect } from "react";

import { useRecipeFilters } from "hooks/useRecipeFilters";
import type { RecipeFetcher } from "hooks/useRecipes";
import { useRecipes } from "hooks/useRecipes";
import { useRecipeTypeDescriptions } from "hooks/useRecipeTypeDescriptions";
import { useRecipeTypes } from "hooks/useRecipeTypes";

export const useRecipeList = (fetcher: RecipeFetcher) => {
    const {
        filters,
        setSelectedTypes,
        setStartDate,
        setEndDate,
        setMinCookingTime,
        setMaxCookingTime,
        setSortOrder,
        buildFilterParams,
    } = useRecipeFilters();

    const { recipes, error, noRecipes, fetchRecipes } = useRecipes(fetcher);
    const { types } = useRecipeTypes();
    const { descriptions, typesHeader } = useRecipeTypeDescriptions(
        filters.selectedTypes,
    );

    const triggerFetch = useCallback(() => {
        void fetchRecipes(buildFilterParams(), filters.sortOrder);
    }, [fetchRecipes, buildFilterParams, filters.sortOrder]);

    useEffect(() => {
        triggerFetch();
    }, [triggerFetch]);

    return {
        filters,
        setSelectedTypes,
        setStartDate,
        setEndDate,
        setMinCookingTime,
        setMaxCookingTime,
        setSortOrder,
        types,
        recipes,
        error,
        noRecipes,
        descriptions,
        typesHeader,
    };
};
