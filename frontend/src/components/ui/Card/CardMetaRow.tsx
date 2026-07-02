import React from "react";

interface CardMetaRowProps {
    label: string;
    value: string;
}

export const CardMetaRow: React.FC<CardMetaRowProps> = ({ label, value }) => (
    <div className="text-sm font-montserratRegular text-gray-500">
        <span>{label}</span>
        <span className="font-bold">{value}</span>
    </div>
);
