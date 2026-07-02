import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { recipeDetailsPath } from "constants/routes";
import type { RecipeListItem } from "types/recipe";

import { splitCookingTime } from "utils/cookingTimeUtils";

import styles from "./RecentRecipeCard.module.scss";

interface RecentRecipeCardProps {
    recipe: RecipeListItem;
}

export const RecentRecipeCard: React.FC<RecentRecipeCardProps> = ({
    recipe,
}) => {
    const { t } = useTranslation("home");
    const { hours, minutes } = splitCookingTime(recipe.cooking_time);
    const timeLabel =
        hours > 0
            ? t("recentRecipes.cookingTimeHoursMinutes", { hours, minutes })
            : t("recentRecipes.cookingTimeMinutesOnly", { minutes });

    return (
        <Link
            to={recipeDetailsPath(recipe.id)}
            className={styles["recent-recipe-card"]}
        >
            <div
                className={styles["recent-recipe-card__image"]}
                aria-hidden="true"
            />
            <div className={styles["recent-recipe-card__body"]}>
                <div className={styles["recent-recipe-card__title"]}>
                    {recipe.title}
                </div>
                <div className={styles["recent-recipe-card__time"]}>
                    {timeLabel}
                </div>
            </div>
        </Link>
    );
};
