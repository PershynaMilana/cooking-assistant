import { useCallback, useState } from "react";

import type { RecipeFilterParams, RecipeListItem } from "types/recipe";

import { getApiErrorMessage } from "api/httpError";

export type RecipeFetcher = (
    params: RecipeFilterParams,
) => Promise<RecipeListItem[]>;

export const useRecipes = (fetcher: RecipeFetcher) => {
    const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [noRecipes, setNoRecipes] = useState(false);

    const fetchRecipes = useCallback(
        async (params: RecipeFilterParams, sortOrder: string) => {
            setError(null);
            setNoRecipes(false);

            try {
                const data = await fetcher(params);

                if (data.length === 0) {
                    setNoRecipes(true);
                    setRecipes([]);
                } else {
                    const sorted = [...data].sort((a, b) => {
                        if (sortOrder === "asc") {
                            return (
                                a.cooking_time - b.cooking_time ||
                                a.title.localeCompare(b.title)
                            );
                        }

                        return (
                            b.cooking_time - a.cooking_time ||
                            a.title.localeCompare(b.title)
                        );
                    });

                    setRecipes(sorted);
                }
            } catch (err: unknown) {
                setError(getApiErrorMessage(err));
            }
        },
        [fetcher],
    );

    return { recipes, error, noRecipes, fetchRecipes };
};
