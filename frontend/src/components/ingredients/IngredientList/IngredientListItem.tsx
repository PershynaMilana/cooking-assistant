import React from "react";
import { useTranslation } from "react-i18next";

import type { PantryIngredient } from "types/userIngredient";

import { formatDate } from "utils/dateUtils";
import { isExpired } from "utils/ingredientExpirationUtils";

interface IngredientListItemProps {
    ingredient: PantryIngredient;
    onOpenHistory: (ingredient: PantryIngredient) => void;
    onDelete: (ingredient: PantryIngredient) => void;
}

export const IngredientListItem: React.FC<IngredientListItemProps> = ({
    ingredient,
    onOpenHistory,
    onDelete,
}) => {
    const { t, i18n } = useTranslation("ingredients");

    const shelfLife = ingredient.days_to_expire ?? null;
    const expired = isExpired(ingredient.purchase_date, shelfLife);

    return (
        <li
            className={`rounded p-2 flex justify-between items-center ${
                expired ? "bg-red-300" : "bg-blue-200"
            }`}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <span className="font-medium">
                    {ingredient.ingredient_name}
                </span>
                <span className="ml-2 text-sm text-gray-700">
                    {ingredient.quantity_person_ingradient} -{" "}
                    {ingredient.unit_name}
                </span>
                <span className="ml-2 text-sm text-black">
                    {t("page.allergens")}
                </span>
                <span className="ml-2 text-sm text-gray-700">
                    {ingredient.allergens}.
                </span>
                <span className="ml-2 text-sm text-black">
                    {t("page.shelfLife")}
                </span>
                <span className="ml-2 text-sm text-gray-700">
                    {shelfLife !== null
                        ? t("page.shelfLifeDays", {
                              days: shelfLife,
                          })
                        : t("page.noExpiration")}
                </span>
                <span className="ml-2 text-sm text-black">
                    {t("page.storageConditions")}
                </span>
                <span className="ml-2 text-sm text-gray-700">
                    {ingredient.storage_condition}.
                </span>
                <span className="ml-2 text-sm text-black">
                    {t("page.season")}
                </span>
                <span className="ml-2 text-sm text-gray-700">
                    {ingredient.seasonality}.
                </span>
                <span className="ml-2 text-sm text-black">
                    {t("page.purchaseDate")}
                </span>
                <span className="ml-2 text-sm text-gray-700">
                    {ingredient.purchase_date
                        ? formatDate(ingredient.purchase_date, i18n.language)
                        : t("page.purchaseDateUnknown")}
                </span>
            </div>
            <div className="flex space-x-2 ml-auto">
                <button
                    onClick={() => {
                        onOpenHistory(ingredient);
                    }}
                    className="bg-amber-500 text-white py-2 px-4 rounded-full"
                >
                    {t("page.detailsButton")}
                </button>
                <button
                    onClick={() => {
                        onDelete(ingredient);
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded-full"
                >
                    {t("page.deleteButton")}
                </button>
            </div>
        </li>
    );
};
