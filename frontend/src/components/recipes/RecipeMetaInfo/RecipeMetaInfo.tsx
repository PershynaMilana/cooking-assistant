import React from "react";
import { useTranslation } from "react-i18next";

import type { RecipeDetails } from "types/recipe";

interface RecipeMetaInfoProps {
    recipe: RecipeDetails;
}

export const RecipeMetaInfo: React.FC<RecipeMetaInfoProps> = ({ recipe }) => {
    const { t } = useTranslation("recipes");

    return (
        <>
            <h3 className="text-relative-ps text-lg font-semibold mt-4 font-montserratMedium">
                <strong>{t("recipeDetailsPage.recipeType")}</strong>{" "}
                {recipe.type_name}
            </h3>

            <p className="text-relative-ps my-[3vh] font-montserratMedium font-semibold">
                {t("recipeDetailsPage.ingredientsCount", {
                    count: recipe.ingredients.length,
                })}
            </p>

            <p className="text-relative-ps mt-[3vh] mb-[1vh] font-montserratMedium font-semibold">
                <strong>{t("recipeDetailsPage.description")}</strong>
            </p>
            <p className="text-relative-ps font-montserratRegular">
                {recipe.content}
            </p>
        </>
    );
};
