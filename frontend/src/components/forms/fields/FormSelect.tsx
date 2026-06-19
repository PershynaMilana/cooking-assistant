import React from "react";

import { FieldError } from "./FieldError";

interface FormSelectOption {
    value: string | number;
    label: string;
}

interface FormSelectProps {
    id: string;
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder: string;
    options: FormSelectOption[];
    error?: string | null;
}

// labelled select with a disabled placeholder option and an inline error.
export const FormSelect: React.FC<FormSelectProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    options,
    error,
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <select
            id={id}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        >
            <option value="" disabled>
                {placeholder}
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        <FieldError message={error} />
    </div>
);
