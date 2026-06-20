import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { getApiErrorMessage } from "api/httpError";
import { createRecipe } from "api/recipesApi";

import { useRecipeForm } from "hooks/useRecipeForm";
import { useRecipeFormData } from "hooks/useRecipeFormData";

import { parseCookingTime } from "utils/cookingTimeUtils";

export const useCreateRecipeForm = () => {
    const { t } = useTranslation("recipes");
    const form = useRecipeForm();
    const { allIngredients, allTypes, fetchError } = useRecipeFormData();
    const navigate = useNavigate();

    const handleSubmit = useCallback(async () => {
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

        try {
            await createRecipe({
                title: form.title,
                content: form.content,
                ingredients: form.selectedIngredients.map((i) => ({
                    id: i.id,
                    quantity: i.quantity,
                })),
                type_id: form.selectedTypeId,
                cooking_time: parseCookingTime(form.cookingTime) ?? 0,
                servings:
                    form.servings !== "" ? Number(form.servings) : undefined,
            });

            navigate(ROUTES.main);
        } catch (err: unknown) {
            form.setError(getApiErrorMessage(err));
        }
    }, [form, navigate, t]);

    return { form, allIngredients, allTypes, fetchError, handleSubmit };
};
