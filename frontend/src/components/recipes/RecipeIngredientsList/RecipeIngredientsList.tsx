import React, { useMemo } from "react";

import type { RecipeDetailIngredient } from "types/recipe";

interface RecipeIngredientsListProps {
    ingredients: RecipeDetailIngredient[];
    heading: string;
}

export const RecipeIngredientsList: React.FC<RecipeIngredientsListProps> = ({
    ingredients,
    heading,
}) => {
    const sorted = useMemo(
        () => ingredients.slice().sort((a, b) => a.name.localeCompare(b.name)),
        [ingredients],
    );

    return (
        <>
            <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
                {heading}
            </h3>
            <ul className="text-relative-ps list-disc font-montserratRegular pl-[3vw]">
                {sorted.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.name} -{" "}
                        {ingredient.quantity_recipe_ingredients}{" "}
                        {ingredient.unit_name}
                    </li>
                ))}
            </ul>
        </>
    );
};
