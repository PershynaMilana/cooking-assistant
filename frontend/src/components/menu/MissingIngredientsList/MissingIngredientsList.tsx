import React from "react";
import { useTranslation } from "react-i18next";

import type { AggregatedIngredient } from "utils/menuUtils";

interface MissingIngredientsListProps {
    ingredients: Record<string, AggregatedIngredient>;
}

export const MissingIngredientsList: React.FC<MissingIngredientsListProps> = ({
    ingredients,
}) => {
    const { t } = useTranslation("menu");

    return (
        <>
            <strong>{t("menuDetailsPage.missingIngredients")}</strong>
            <ul>
                {Object.entries(ingredients).map(([name, data]) => (
                    <li key={name} className="text-relative-ps">
                        {name}: {data.quantity} {data.unit}
                    </li>
                ))}
            </ul>
        </>
    );
};
