import React from "react";

interface CookingTimeFieldProps {
    id: string;
    label: string;
    value: string;
    error: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const CookingTimeField: React.FC<CookingTimeFieldProps> = ({
    id,
    label,
    value,
    error,
    onChange,
    placeholder,
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            id={id}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        {error && <div className="text-red-500">{error}</div>}
    </div>
);
