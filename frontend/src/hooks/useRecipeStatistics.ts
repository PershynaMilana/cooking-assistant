import { useEffect, useState } from "react";

import { logger } from "config/logger";
import type { RecipeWithIngredientNames } from "types/recipe";

import { getRecipes } from "api/recipesApi";

export interface RecipeTypeStat {
    typeName: string;
    count: number;
}

export interface RecipeStatisticsResult {
    stats: RecipeTypeStat[];
    recipesCount: number;
    fastestRecipes: RecipeWithIngredientNames[];
    slowestRecipes: RecipeWithIngredientNames[];
    mostIngredientsRecipes: RecipeWithIngredientNames[];
    leastIngredientsRecipes: RecipeWithIngredientNames[];
}

export const useRecipeStatistics = (): RecipeStatisticsResult => {
    const [stats, setStats] = useState<RecipeTypeStat[]>([]);
    const [fastestRecipes, setFastestRecipes] = useState<
        RecipeWithIngredientNames[]
    >([]);
    const [slowestRecipes, setSlowestRecipes] = useState<
        RecipeWithIngredientNames[]
    >([]);
    const [mostIngredientsRecipes, setMostIngredientsRecipes] = useState<
        RecipeWithIngredientNames[]
    >([]);
    const [recipesCount, setRecipesCount] = useState(0);
    const [leastIngredientsRecipes, setLeastIngredientsRecipes] = useState<
        RecipeWithIngredientNames[]
    >([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const recipes = await getRecipes();

                setRecipesCount(recipes.length);

                const typeCounts: Record<string, number> = {};

                recipes.forEach((recipe) => {
                    typeCounts[recipe.type_name] =
                        (typeCounts[recipe.type_name] || 0) + 1;
                });

                setStats(
                    Object.keys(typeCounts).map((typeName) => ({
                        typeName,
                        count: typeCounts[typeName],
                    })),
                );

                if (recipes.length > 0) {
                    const minTime = Math.min(
                        ...recipes.map((recipe) => recipe.cooking_time),
                    );
                    const maxTime = Math.max(
                        ...recipes.map((recipe) => recipe.cooking_time),
                    );

                    setFastestRecipes(
                        recipes.filter(
                            (recipe) => recipe.cooking_time === minTime,
                        ),
                    );
                    setSlowestRecipes(
                        recipes.filter(
                            (recipe) => recipe.cooking_time === maxTime,
                        ),
                    );

                    const maxIngredients = Math.max(
                        ...recipes.map((recipe) => recipe.ingredients.length),
                    );
                    const minIngredients = Math.min(
                        ...recipes.map((recipe) => recipe.ingredients.length),
                    );

                    setMostIngredientsRecipes(
                        recipes.filter(
                            (recipe) =>
                                recipe.ingredients.length === maxIngredients,
                        ),
                    );
                    setLeastIngredientsRecipes(
                        recipes.filter(
                            (recipe) =>
                                recipe.ingredients.length === minIngredients,
                        ),
                    );
                }
            } catch (error) {
                logger.error("Error fetching statistics:", error);
            }
        };

        void fetchStats();
    }, []);

    return {
        stats,
        recipesCount,
        fastestRecipes,
        slowestRecipes,
        mostIngredientsRecipes,
        leastIngredientsRecipes,
    };
};
