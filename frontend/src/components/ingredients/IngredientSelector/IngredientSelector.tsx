import React from "react";

import type { Ingredient } from "types/ingredient";
import type { PantryIngredient } from "types/userIngredient";

interface IngredientSelectorProps {
    allIngredients: Ingredient[];
    personIngredients: PantryIngredient[];
    selectedIngredients: number[];
    onToggle: (id: number) => void;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
    allIngredients,
    personIngredients,
    selectedIngredients,
    onToggle,
}) => {
    const availableIngredients = allIngredients.filter(
        (ingredient) =>
            !personIngredients.some(
                (existing) => existing.id === ingredient.id,
            ),
    );

    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {availableIngredients.map((ingredient) => (
                <button
                    key={ingredient.id}
                    type="button"
                    onClick={() => {
                        onToggle(ingredient.id);
                    }}
                    className={`py-2 px-4 rounded-full ${
                        selectedIngredients.includes(ingredient.id)
                            ? "bg-blue-700 text-white"
                            : "bg-gray-300 text-black"
                    }`}
                >
                    {ingredient.name}
                </button>
            ))}
        </div>
    );
};
