import { useCallback, useEffect, useState } from "react";

import type { RecipeTypeSummary } from "types/recipeType";

import { getRecipeTypes } from "api/recipeTypesApi";

export const useRecipeTypes = () => {
    const [types, setTypes] = useState<RecipeTypeSummary[]>([]);

    const reload = useCallback(async () => {
        try {
            const data = await getRecipeTypes();

            setTypes(data);
        } catch (err) {
            console.error("Error fetching recipe types:", err);
        }
    }, []);

    useEffect(() => {
        void reload();
    }, [reload]);

    return { types, reload };
};
