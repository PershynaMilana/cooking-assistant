import React from "react";

import { FieldError } from "./FieldError";

interface FormFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    error?: string | null;
}

// labelled single-line text input with an inline error. The shared building block
// for every text field across the forms.
export const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    value,
    onChange,
    type = "text",
    error,
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        <FieldError message={error} />
    </div>
);
