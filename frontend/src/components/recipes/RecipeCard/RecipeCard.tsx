import React from "react";
import { useTranslation } from "react-i18next";

import { recipeDetailsPath } from "constants/routes";

import { Card, CardMetaRow } from "components/ui/Card";

import { splitCookingTime } from "utils/cookingTimeUtils";
import { formatDate } from "utils/dateUtils";

interface RecipeCardProps {
    id: number;
    title: string;
    typeName: string;
    creationDate: string;
    cookingTime: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
    id,
    title,
    typeName,
    creationDate,
    cookingTime,
}) => {
    const { t, i18n } = useTranslation("recipes");

    const { hours, minutes } = splitCookingTime(cookingTime);
    const formattedTime = t("recipeCard.cookingTimeValue", {
        hours,
        minutes: String(minutes).padStart(2, "0"),
    });
    const formattedDate = formatDate(creationDate, i18n.language);

    return (
        <Card
            title={title}
            to={recipeDetailsPath(id)}
            actionLabel={t("recipeCard.learnMore")}
        >
            <CardMetaRow label={t("recipeCard.recipeType")} value={typeName} />
            <CardMetaRow
                label={t("recipeCard.cookingTime")}
                value={formattedTime}
            />
            <div className="text-sm text-gray-500">
                {t("recipeCard.creationDate")} {formattedDate}
            </div>
        </Card>
    );
};
