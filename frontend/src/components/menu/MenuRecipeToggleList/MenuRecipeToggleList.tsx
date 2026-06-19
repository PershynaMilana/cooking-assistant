import React from "react";

import type { RecipeListItem } from "types/recipe";

import { ToggleButtonGroup } from "components/ui/ToggleButtonGroup";

interface MenuRecipeToggleListProps {
    allRecipes: RecipeListItem[];
    selectedRecipes: number[];
    onToggle: (id: number) => void;
    label: string;
    errorMessage: string | null;
}

const SELECTED_CLASS = "py-2 px-4 border rounded-md bg-blue-500 text-white";
const UNSELECTED_CLASS = "py-2 px-4 border rounded-md bg-white text-black";

export const MenuRecipeToggleList: React.FC<MenuRecipeToggleListProps> = ({
    allRecipes,
    selectedRecipes,
    onToggle,
    label,
    errorMessage,
}) => (
    <ToggleButtonGroup
        label={label}
        items={allRecipes}
        selectedIds={selectedRecipes}
        onToggle={(recipe) => {
            onToggle(recipe.id);
        }}
        getKey={(recipe) => recipe.id}
        getLabel={(recipe) => recipe.title}
        selectedClassName={SELECTED_CLASS}
        unselectedClassName={UNSELECTED_CLASS}
        errorMessage={errorMessage}
    />
);
