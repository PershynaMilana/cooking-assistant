import React from "react";

import type { Ingredient } from "types/ingredient";

import { ToggleButtonGroup } from "components/ui/ToggleButtonGroup";

interface IngredientPickerProps {
    allIngredients: Ingredient[];
    selectedIds: number[];
    label: string;
    onToggle: (ingredient: Ingredient) => void;
}

const SELECTED_CLASS = "bg-green-500 text-white px-4 py-2 rounded-md";
const UNSELECTED_CLASS = "bg-gray-300 px-4 py-2 rounded-md";

export const IngredientPicker: React.FC<IngredientPickerProps> = ({
    allIngredients,
    selectedIds,
    label,
    onToggle,
}) => (
    <ToggleButtonGroup
        label={label}
        items={allIngredients}
        selectedIds={selectedIds}
        onToggle={onToggle}
        getKey={(ingredient) => ingredient.id}
        getLabel={(ingredient) => ingredient.name}
        selectedClassName={SELECTED_CLASS}
        unselectedClassName={UNSELECTED_CLASS}
    />
);
