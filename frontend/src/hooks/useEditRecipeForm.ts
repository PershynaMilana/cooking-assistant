import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { getApiErrorMessage } from "api/httpError";
import { getRecipeById, updateRecipe } from "api/recipesApi";

import { useRecipeForm } from "hooks/useRecipeForm";
import { useRecipeFormData } from "hooks/useRecipeFormData";

import {
    formatCookingTimeInput,
    parseCookingTime,
} from "utils/cookingTimeUtils";

export const useEditRecipeForm = (id: string | undefined) => {
    const { t } = useTranslation("recipes");
    const form = useRecipeForm();
    const { setInitialValues, setError } = form;
    const { allIngredients, allTypes } = useRecipeFormData();
    const navigate = useNavigate();

    const fetchRecipeDetails = useCallback(async () => {
        if (!id) {
            return;
        }

        try {
            const recipeData = await getRecipeById(id);

            setInitialValues({
                title: recipeData.title,
                content: recipeData.content,
                cookingTime: formatCookingTimeInput(recipeData.cooking_time),
                servings: recipeData.servings || "",
                selectedTypeId: recipeData.type_id,
                selectedIngredients: recipeData.ingredients.map((i) => ({
                    id: i.id,
                    name: i.name,
                    quantity: i.quantity_recipe_ingredients,
                    unit_name: i.unit_name,
                })),
            });
        } catch (err: unknown) {
            setError(getApiErrorMessage(err));
        }
    }, [id, setInitialValues, setError]);

    useEffect(() => {
        void fetchRecipeDetails();
    }, [fetchRecipeDetails]);

    const handleSubmit = useCallback(async () => {
        if (!id) {
            return;
        }

        if (
            !form.validateChange({
                errorCookingTimeFormat: t(
                    "changeRecipePage.errorCookingTimeFormat",
                ),
                errorCookingTimeInvalid: t(
                    "changeRecipePage.errorCookingTimeInvalid",
                ),
                errorServings: t("changeRecipePage.errorServings"),
            })
        ) {
            return;
        }

        try {
            await updateRecipe(id, {
                title: form.title,
                content: form.content,
                type_id: form.selectedTypeId,
                cooking_time: parseCookingTime(form.cookingTime) ?? 0,
                servings: form.servings,
                ingredients: form.selectedIngredients.map(
                    ({ id: recipeId, quantity }) => ({
                        id: recipeId,
                        quantity_recipe_ingredients: quantity,
                    }),
                ),
            });

            navigate(ROUTES.home);
        } catch (err: unknown) {
            form.setError(getApiErrorMessage(err));
        }
    }, [form, id, navigate, t]);

    return { form, allIngredients, allTypes, handleSubmit };
};
