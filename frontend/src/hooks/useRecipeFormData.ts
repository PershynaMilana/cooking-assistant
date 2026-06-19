import { useEffect, useState } from "react";

import type { Ingredient } from "types/ingredient";
import type { RecipeTypeSummary } from "types/recipeType";

import { getApiErrorMessage } from "api/httpError";
import { getIngredients } from "api/ingredientsApi";
import { getRecipeTypes } from "api/recipeTypesApi";

export const useRecipeFormData = () => {
    const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
    const [allTypes, setAllTypes] = useState<RecipeTypeSummary[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ingredients, types] = await Promise.all([
                    getIngredients(),
                    getRecipeTypes(),
                ]);

                setAllIngredients(
                    ingredients.sort((a, b) =>
                        a.name.localeCompare(b.name, "uk"),
                    ),
                );
                setAllTypes(types);
            } catch (err: unknown) {
                setFetchError(getApiErrorMessage(err));
            }
        };

        void fetchData();
    }, []);

    return { allIngredients, allTypes, fetchError };
};
