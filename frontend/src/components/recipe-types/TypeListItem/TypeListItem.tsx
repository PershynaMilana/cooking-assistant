import React from "react";

import type { RecipeTypeSummary } from "types/recipeType";

interface TypeListItemProps {
    type: RecipeTypeSummary;
}

export const TypeListItem: React.FC<TypeListItemProps> = ({ type }) => (
    <li className="bg-gray-100 rounded-lg my-5 p-4 flex items-center justify-between">
        <span className="text-left">{type.type_name}</span>
    </li>
);
