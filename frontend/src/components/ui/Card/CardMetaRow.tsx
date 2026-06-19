import React from "react";

interface CardMetaRowProps {
    label: string;
    value: string;
}

// one "label: bold value" line inside a Card body. Reused by every card that shows
// labelled metadata (recipe type/time, menu category, ...).
export const CardMetaRow: React.FC<CardMetaRowProps> = ({ label, value }) => (
    <div className="text-sm font-montserratRegular text-gray-500">
        <span>{label}</span>
        <span className="font-bold">{value}</span>
    </div>
);
