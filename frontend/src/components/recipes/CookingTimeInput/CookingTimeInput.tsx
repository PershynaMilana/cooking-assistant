import React from "react";

interface CookingTimeInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    min: string;
}

export const CookingTimeInput: React.FC<CookingTimeInputProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder,
    min,
}) => (
    <div className="flex items-center mb-2 sm:mb-0">
        <label htmlFor={id} className="mr-2">
            {label}
        </label>
        <input
            type="number"
            id={id}
            value={value}
            onChange={(e) => {
                onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="border rounded p-2 w-20"
            min={min}
            onKeyDown={(e) => {
                if (e.key === "+" || e.key === "-") {
                    e.preventDefault();
                }
            }}
            onInput={(e) => {
                const target = e.target as HTMLInputElement;

                target.value = target.value.replace(/\D/g, "");
            }}
        />
    </div>
);
