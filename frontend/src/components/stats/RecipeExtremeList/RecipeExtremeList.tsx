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
    <div>
        <strong>{label}</strong>
        <ul>
            {recipes.map((recipe) => (
                <li key={recipe.id}>
                    {recipe.title} ({getValue(recipe)}
                    {unit})
                </li>
            ))}
        </ul>
    </div>
);
