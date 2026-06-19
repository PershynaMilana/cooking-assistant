import React from "react";

import { FieldError } from "./FieldError";

interface FormTextAreaProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    error?: string | null;
}

// labelled multi-line text input with an inline error.
export const FormTextArea: React.FC<FormTextAreaProps> = ({
    id,
    label,
    value,
    onChange,
    rows = 4,
    error,
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <textarea
            id={id}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            rows={rows}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
        <FieldError message={error} />
    </div>
);
