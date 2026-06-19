import React from "react";
import { useTranslation } from "react-i18next";

import type { PantryIngredient } from "types/userIngredient";

interface QuantityEditorProps {
    ingredients: PantryIngredient[];
    onQuantityChange: (id: number, quantity: number) => void;
    onSave: () => void;
}

export const QuantityEditor: React.FC<QuantityEditorProps> = ({
    ingredients,
    onQuantityChange,
    onSave,
}) => {
    const { t } = useTranslation("ingredients");

    return (
        <div>
            {ingredients.map((ingredient) => (
                <div
                    key={ingredient.id}
                    className="flex items-center justify-between mb-2"
                >
                    <span className="font-medium">
                        {ingredient.ingredient_name}
                    </span>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            value={ingredient.quantity_person_ingradient}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);

                                if (!isNaN(value)) {
                                    onQuantityChange(ingredient.id, value);
                                }
                            }}
                            className="border border-gray-300 rounded p-1 w-20 text-center"
                        />
                        <span className="text-gray-700">
                            {ingredient.unit_name}
                        </span>
                    </div>
                </div>
            ))}
            <button
                onClick={onSave}
                className="bg-green-500 text-white py-2 px-4 rounded-full mt-4 block mx-auto"
            >
                {t("page.saveQuantitiesButton")}
            </button>
        </div>
    );
};
