import React from "react";

import type { RecipeWithIngredientNames } from "types/recipe";

interface RecipeExtremeListProps {
    label: string;
    recipes: RecipeWithIngredientNames[];
    unit: string;
    getValue: (r: RecipeWithIngredientNames) => string | number;
}

export const RecipeExtremeList: React.FC<RecipeExtremeListProps> = ({
    label,
    recipes,
    unit,
    getValue,
}) => (
    <div className="mb-4 last:mb-0">
        <p className="text-sm font-semibold text-gray-700 mb-1.5">{label}</p>
        <ul className="space-y-1.5">
            {recipes.map((recipe) => (
                <li
                    key={recipe.id}
                    className="flex justify-between bg-gray-100 rounded-lg px-3 py-1.5 text-sm"
                >
                    <span>{recipe.title}</span>
                    <span className="text-gray-600">
                        {getValue(recipe)}
                        {unit}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);
