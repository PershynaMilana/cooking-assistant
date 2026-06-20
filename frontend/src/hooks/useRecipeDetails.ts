import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";
import type { RecipeDetails } from "types/recipe";

import { deleteRecipe, getRecipeById } from "api/recipesApi";

export const useRecipeDetails = (id: string | undefined) => {
    const { t } = useTranslation("recipes");
    const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchErrorRef = useRef("");

    fetchErrorRef.current = t("recipeDetailsPage.errorFetch");

    const fetchRecipeDetails = useCallback(async () => {
        if (!id) {
            return;
        }

        try {
            setRecipe(await getRecipeById(id));
        } catch {
            setError(fetchErrorRef.current);
        }
    }, [id]);

    useEffect(() => {
        void fetchRecipeDetails();
    }, [fetchRecipeDetails]);

    const handleDelete = useCallback(async () => {
        if (!id) {
            return;
        }

        try {
            await deleteRecipe(id);
            navigate(ROUTES.main);
        } catch {
            setError(t("recipeDetailsPage.errorDelete"));
        }
    }, [id, navigate, t]);

    const isOwner = recipe?.isOwner ?? false;

    return { recipe, error, isOwner, deleteRecipe: handleDelete };
};
