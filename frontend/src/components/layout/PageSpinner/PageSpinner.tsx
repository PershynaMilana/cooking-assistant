import React from "react";

export const PageSpinner: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div
            role="status"
            className="w-8 h-8 border-4 border-dark-purple border-t-transparent rounded-full animate-spin"
        />
    </div>
);
