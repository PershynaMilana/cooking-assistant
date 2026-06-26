import React from "react";
import { useTranslation } from "react-i18next";

import type { RecipeWithIngredientNames } from "types/recipe";
import type { RecipeTypeStat } from "types/stats";

import { RecipeExtremeList } from "components/stats/RecipeExtremeList";

interface RecipeTypesSummaryProps {
    stats: RecipeTypeStat[];
    fastestRecipes: RecipeWithIngredientNames[];
    slowestRecipes: RecipeWithIngredientNames[];
    mostIngredientsRecipes: RecipeWithIngredientNames[];
    leastIngredientsRecipes: RecipeWithIngredientNames[];
}

export const RecipeTypesSummary: React.FC<RecipeTypesSummaryProps> = ({
    stats,
    fastestRecipes,
    slowestRecipes,
    mostIngredientsRecipes,
    leastIngredientsRecipes,
}) => {
    const { t } = useTranslation("stats");

    return (
        <div className="ml-6 flex flex-col">
            <h2 className="text-h3 font-semibold mb-4">
                {t("statsPage.recipeTypesSummary")}
            </h2>
            <ul className="space-y-2">
                {stats.map((stat) => (
                    <li
                        key={stat.typeName}
                        className="flex justify-between bg-gray-100 p-2 rounded-md"
                    >
                        <span className="font-medium">{stat.typeName}</span>
                        <span className="text-gray-600">{stat.count}</span>
                    </li>
                ))}
            </ul>

            <div className="mt-4">
                <h2 className="text-h3 font-semibold mb-2">
                    {t("statsPage.recipeDetails")}
                </h2>
                <RecipeExtremeList
                    label={t("statsPage.fastestRecipes")}
                    recipes={fastestRecipes}
                    unit={t("statsPage.cookingTimeUnit")}
                    getValue={(r) => r.cooking_time}
                />
                <RecipeExtremeList
                    label={t("statsPage.slowestRecipes")}
                    recipes={slowestRecipes}
                    unit={t("statsPage.cookingTimeUnit")}
                    getValue={(r) => r.cooking_time}
                />
                <RecipeExtremeList
                    label={t("statsPage.mostIngredients")}
                    recipes={mostIngredientsRecipes}
                    unit={t("statsPage.ingredientsUnit")}
                    getValue={(r) => r.ingredients.length}
                />
                <RecipeExtremeList
                    label={t("statsPage.leastIngredients")}
                    recipes={leastIngredientsRecipes}
                    unit={t("statsPage.ingredientsUnit")}
                    getValue={(r) => r.ingredients.length}
                />
            </div>
        </div>
    );
};
