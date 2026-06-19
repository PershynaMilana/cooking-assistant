import React from "react";

import type { RecipeTypeSummary } from "types/recipeType";

interface RecipeTypeDescriptionsProps {
    descriptions: RecipeTypeSummary[];
}

export const RecipeTypeDescriptions: React.FC<RecipeTypeDescriptionsProps> = ({
    descriptions,
}) => {
    if (descriptions.length === 0) {
        return null;
    }

    return (
        <div className="mb-4">
            {descriptions.map((type) => (
                <p key={type.id} className="text-gray-600">
                    <strong>{type.type_name}:</strong> {type.description}
                </p>
            ))}
        </div>
    );
};
