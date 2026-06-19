import React from "react";

import type { RecipeTypeSummary } from "types/recipeType";

interface TypeListItemProps {
    type: RecipeTypeSummary;
    onEdit: () => void;
    onDelete: () => void;
    editLabel: string;
    deleteLabel: string;
}

export const TypeListItem: React.FC<TypeListItemProps> = ({
    type,
    onEdit,
    onDelete,
    editLabel,
    deleteLabel,
}) => (
    <li className="bg-gray-100 rounded-lg my-5 p-4 flex items-center justify-between">
        <span className="text-left">{type.type_name}</span>
        <div className="flex space-x-2">
            <button
                className="bg-yellow-500 text-white py-2 px-4 rounded-full"
                onClick={onEdit}
            >
                {editLabel}
            </button>
            <button
                className="bg-red-500 text-white py-2 px-4 rounded-full"
                onClick={onDelete}
            >
                {deleteLabel}
            </button>
        </div>
    </li>
);
