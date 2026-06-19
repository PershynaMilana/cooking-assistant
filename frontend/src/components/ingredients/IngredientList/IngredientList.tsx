import React from "react";
import { useTranslation } from "react-i18next";

import type { PantryIngredient } from "types/userIngredient";

import { IngredientListItem } from "./IngredientListItem";

interface IngredientListProps {
    ingredients: PantryIngredient[];
    onOpenHistory: (ingredient: PantryIngredient) => void;
    onDelete: (ingredient: PantryIngredient) => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({
    ingredients,
    onOpenHistory,
    onDelete,
}) => {
    const { t } = useTranslation("ingredients");

    if (ingredients.length === 0) {
        return (
            <p className="text-center text-gray-600 mb-4">
                {t("page.noIngredients")}
            </p>
        );
    }

    return (
        <ul className="space-y-2">
            {ingredients.map((ingredient) => (
                <IngredientListItem
                    key={ingredient.id}
                    ingredient={ingredient}
                    onOpenHistory={onOpenHistory}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};
