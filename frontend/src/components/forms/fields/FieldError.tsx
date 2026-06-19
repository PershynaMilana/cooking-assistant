import React from "react";

interface FieldErrorProps {
    message?: string | null;
}

// inline validation message under a form field. Renders nothing when there is no
// error, so callers can drop it in unconditionally.
export const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
    if (!message) {
        return null;
    }

    return <div className="text-red-500 text-sm mt-1">{message}</div>;
};
