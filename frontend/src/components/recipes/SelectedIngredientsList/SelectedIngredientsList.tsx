import React from "react";

import type { RecipeFormIngredient } from "types/recipe";

interface SelectedIngredientsListProps {
    ingredients: RecipeFormIngredient[];
    heading: string;
    onQuantityChange: (id: number, quantity: number) => void;
}

export const SelectedIngredientsList: React.FC<
    SelectedIngredientsListProps
> = ({ ingredients, heading, onQuantityChange }) => (
    <div>
        <h4 className="font-bold mt-4">{heading}</h4>
        {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center space-x-2">
                <span>{ingredient.name}</span>
                <input
                    type="number"
                    min={1}
                    value={ingredient.quantity}
                    onChange={(e) => {
                        const value = parseInt(e.target.value, 10);

                        if (!isNaN(value)) {
                            onQuantityChange(ingredient.id, value);
                        }
                    }}
                    className="w-20 p-2 border border-gray-300 rounded-md"
                />
                <span className="text-gray-700">{ingredient.unit_name}</span>
            </div>
        ))}
    </div>
);
