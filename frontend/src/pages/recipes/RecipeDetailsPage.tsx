import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { useRecipeDetails } from "hooks/useRecipeDetails";

import { Header } from "components/layout/Header";
import { RecipeIngredientsList } from "components/recipes/RecipeIngredientsList";
import { RecipeMetaInfo } from "components/recipes/RecipeMetaInfo";
import { RecipeOwnerActions } from "components/recipes/RecipeOwnerActions";
import { Modal } from "components/ui/Modal";

import { splitCookingTime } from "utils/cookingTimeUtils";
import { formatDate } from "utils/dateUtils";

const RecipeDetailsPage: React.FC = () => {
    const { t, i18n } = useTranslation("recipes");
    const { id } = useParams<{ id: string }>();
    const { recipe, error, isOwner, deleteRecipe } = useRecipeDetails(id);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (error) {
        return (
            <div className="text-red-500">
                {t("recipeDetailsPage.error", { message: error })}
            </div>
        );
    }

    if (!recipe) {
        return <div>{t("recipeDetailsPage.loading")}</div>;
    }

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
                            setIsModalOpen(true);
                        }}
                    />
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                title={t("recipeDetailsPage.deleteTitle")}
                message={t("recipeDetailsPage.deleteMessage")}
                onClose={() => {
                    setIsModalOpen(false);
                }}
                onConfirm={() => {
                    void deleteRecipe();
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
};

export default RecipeDetailsPage;
