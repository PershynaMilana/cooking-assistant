import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { useGetIngredientsQuery } from "redux/services/ingredientsApi";
import { useCreateRecipeMutation } from "redux/services/recipesApi";
import { useGetRecipeTypesQuery } from "redux/services/recipeTypesApi";

import { useRecipeForm } from "hooks/useRecipeForm";

import { RecipeForm } from "components/forms/RecipeForm";
import { Header } from "components/layout/Header";

import { parseCookingTime } from "utils/cookingTimeUtils";
import { sortIngredientsByName } from "utils/sortIngredientsByName";

const CreateRecipePage: React.FC = () => {
    const { t } = useTranslation("recipes");
    const form = useRecipeForm();
    const navigate = useNavigate();
    const { data: ingredients } = useGetIngredientsQuery(null);
    const { data: allTypes = [] } = useGetRecipeTypesQuery(null);
    const [createRecipe] = useCreateRecipeMutation();

    const allIngredients = useMemo(
        () => sortIngredientsByName(ingredients ?? [], "uk"),
        [ingredients],
    );

    const handleSubmit = async () => {
        if (
            !form.validateCreate({
                errorTitle: t("createRecipePage.errorTitle"),
                errorDescription: t("createRecipePage.errorDescription"),
                errorIngredients: t("createRecipePage.errorIngredients"),
                errorType: t("createRecipePage.errorType"),
                errorCookingTimeFormat: t(
                    "createRecipePage.errorCookingTimeFormat",
                ),
                errorCookingTimeInvalid: t(
                    "createRecipePage.errorCookingTimeInvalid",
                ),
                errorServings: t("createRecipePage.errorServings"),
            })
        ) {
            return;
        }

        // a failed mutation is already toasted by the global listener
        const result = await createRecipe({
            title: form.title,
            content: form.content,
            ingredients: form.selectedIngredients.map((i) => ({
                id: i.id,
                quantity: i.quantity,
            })),
            type_id: form.selectedTypeId,
            cooking_time: parseCookingTime(form.cookingTime) ?? 0,
            servings: form.servings !== "" ? Number(form.servings) : undefined,
        });

        if ("data" in result) {
            navigate(ROUTES.main);
        }
    };

    return (
        <div>
            <Header />
            <div className="mx-[15vw]">
                <h1 className="text-relative-h3 my-[7vh] font-kharkiv font-bold mb-4">
                    {t("createRecipePage.heading")}
                </h1>
                <RecipeForm
                    form={form}
                    allIngredients={allIngredients}
                    allTypes={allTypes}
                    keyPrefix="createRecipePage"
                    idPrefix="create-recipe"
                    cookingTimePlaceholder={t(
                        "createRecipePage.cookingTimePlaceholder",
                    )}
                    typeError={form.typeError}
                    error={form.error}
                    submitLabel={t("createRecipePage.createButton")}
                    onSubmit={() => {
                        void handleSubmit();
                    }}
                />
            </div>
        </div>
    );
};

export default CreateRecipePage;
