import React, { useState } from "react";

import { FieldError } from "./FieldError";

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    showLabel: string;
    hideLabel: string;
    error?: string | null;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
    id,
    label,
    value,
    onChange,
    showLabel,
    hideLabel,
    error,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                    type="button"
                    onClick={() => {
                        setShowPassword((prev) => !prev);
                    }}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                    {showPassword ? hideLabel : showLabel}
                </button>
            </div>
            <FieldError message={error} />
        </div>
    );
};
