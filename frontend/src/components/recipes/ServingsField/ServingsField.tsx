import React from "react";

interface ServingsFieldProps {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}

export const ServingsField: React.FC<ServingsFieldProps> = ({
    id,
    label,
    placeholder,
    value,
    onChange,
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            id={id}
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        />
    </div>
);
