import React from "react";

interface FieldErrorProps {
    message?: string | null;
}

export const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
    if (!message) {
        return null;
    }

    return <div className="text-red-500 text-sm mt-1">{message}</div>;
};
