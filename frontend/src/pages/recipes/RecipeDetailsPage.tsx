import { skipToken } from "@reduxjs/toolkit/query";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useAppDispatch } from "redux/hooks";
import { useGetRecipeByIdQuery } from "redux/services/recipesApi";
import { MODAL_TYPE, openModal } from "redux/slices/uiSlice";

import { Header } from "components/layout/Header";
import { RecipeIngredientsList } from "components/recipes/RecipeIngredientsList";
import { RecipeMetaInfo } from "components/recipes/RecipeMetaInfo";
import { RecipeOwnerActions } from "components/recipes/RecipeOwnerActions";

import { splitCookingTime } from "utils/cookingTimeUtils";
import { formatDate } from "utils/dateUtils";

const RecipeDetailsPage: React.FC = () => {
    const { t, i18n } = useTranslation("recipes");
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { data: recipe, isError } = useGetRecipeByIdQuery(id ?? skipToken);

    if (isError) {
        return (
            <div className="text-red-500">
                {t("recipeDetailsPage.error", {
                    message: t("recipeDetailsPage.errorFetch"),
                })}
            </div>
        );
    }

    if (!recipe) {
        return <div>{t("recipeDetailsPage.loading")}</div>;
    }

    const isOwner = recipe.isOwner;
    const formattedDate = formatDate(recipe.creation_date, i18n.language);
    const { hours, minutes } = splitCookingTime(recipe.cooking_time);
    const formattedCookingTime =
        hours > 0
            ? t("recipeDetailsPage.cookingTimeHoursMinutes", { hours, minutes })
            : t("recipeDetailsPage.cookingTimeMinutes", { minutes });

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {recipe.title}
                </h1>

                <RecipeMetaInfo recipe={recipe} />

                <RecipeIngredientsList
                    ingredients={recipe.ingredients}
                    heading={t("recipeDetailsPage.ingredients")}
                />

                <p className="text-relative-ps mt-4 font-montserratRegular">
                    <strong>{t("recipeDetailsPage.cookingTime")}</strong>{" "}
                    {formattedCookingTime}
                </p>
                <p className="text-relative-ps mt-4 font-montserratRegular">
                    <strong>{t("recipeDetailsPage.creationDate")}</strong>{" "}
                    {formattedDate}
                </p>
                <p className="text-relative-ps mt-4 font-montserratRegular">
                    <strong>{t("recipeDetailsPage.servings")}</strong>{" "}
                    {recipe.servings}
                </p>

                {isOwner && (
                    <RecipeOwnerActions
                        recipeId={recipe.id}
                        onDelete={() => {
                            dispatch(
                                openModal({
                                    type: MODAL_TYPE.deleteRecipe,
                                    recipeId: String(recipe.id),
                                }),
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default RecipeDetailsPage;
