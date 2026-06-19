import React from "react";

import type { RecipeTypeSummary } from "types/recipeType";

interface RecipeTypeSelectProps {
    id: string;
    label: string;
    placeholder: string;
    types: RecipeTypeSummary[];
    value: number | null;
    error: string | null;
    onChange: (id: number | null) => void;
}

export const RecipeTypeSelect: React.FC<RecipeTypeSelectProps> = ({
    id,
    label,
    placeholder,
    types,
    value,
    error,
    onChange,
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            id={id}
            value={value ?? ""}
            onChange={(e) => {
                onChange(e.target.value === "" ? null : Number(e.target.value));
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
            required
        >
            <option value="" disabled>
                {placeholder}
            </option>
            {types.map((type) => (
                <option key={type.id} value={type.id}>
                    {type.type_name}
                </option>
            ))}
        </select>
        {error && <div className="text-red-500">{error}</div>}
    </div>
);
