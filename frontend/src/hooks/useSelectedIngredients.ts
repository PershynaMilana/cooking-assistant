import { useCallback, useState } from "react";

import type { Ingredient } from "types/ingredient";
import type { RecipeFormIngredient } from "types/recipe";

export const useSelectedIngredients = () => {
    const [selectedIngredients, setSelectedIngredients] = useState<
        RecipeFormIngredient[]
    >([]);

    const toggleIngredientSelection = useCallback((ingredient: Ingredient) => {
        setSelectedIngredients((prev) => {
            const existing = prev.find((i) => i.id === ingredient.id);

            if (existing) {
                return prev.filter((i) => i.id !== ingredient.id);
            }

            return [
                ...prev,
                {
                    id: ingredient.id,
                    name: ingredient.name,
                    quantity: 1,
                    unit_name: ingredient.unit_name,
                },
            ];
        });
    }, []);

    const updateIngredientQuantity = useCallback(
        (ingredientId: number, quantity: number) => {
            setSelectedIngredients((prev) =>
                prev.map((ingredient) =>
                    ingredient.id === ingredientId
                        ? { ...ingredient, quantity: Math.max(quantity, 1) }
                        : ingredient,
                ),
            );
        },
        [],
    );

    return {
        selectedIngredients,
        setSelectedIngredients,
        toggleIngredientSelection,
        updateIngredientQuantity,
    };
};
