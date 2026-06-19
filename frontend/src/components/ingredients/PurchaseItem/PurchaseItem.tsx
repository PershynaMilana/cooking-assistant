import React from "react";

import type { Purchase } from "types/userIngredient";

import { formatDate } from "utils/dateUtils";
import { isExpired } from "utils/ingredientExpirationUtils";

interface PurchaseItemProps {
    purchase: Purchase;
    language: string;
    onQuantityChange: (id: number, quantity: number) => void;
    onSave: (id: number, quantity: number) => Promise<void>;
}

export const PurchaseItem: React.FC<PurchaseItemProps> = ({
    purchase,
    language,
    onQuantityChange,
    onSave,
}) => {
    const expired = isExpired(purchase.purchase_date, purchase.days_to_expire);

    return (
        <li
            className={`flex justify-between items-center p-2 rounded ${
                expired ? "bg-red-100" : "bg-gray-100"
            }`}
        >
            <span>{formatDate(purchase.purchase_date, language)}</span>
            <input
                type="number"
                min={1}
                className="w-16 text-center border rounded"
                value={purchase.quantity}
                onChange={(e) => {
                    onQuantityChange(purchase.id, +e.target.value);
                }}
                onBlur={(e) => {
                    void onSave(purchase.id, +e.target.value);
                }}
            />
            <span>{purchase.unit_name}</span>
        </li>
    );
};
