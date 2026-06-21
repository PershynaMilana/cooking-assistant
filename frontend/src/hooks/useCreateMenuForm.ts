import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";
import type { MenuCategory } from "types/menu";
import type { RecipeListItem } from "types/recipe";

import { getMenuCategories } from "api/menuCategoriesApi";
import { createMenu } from "api/menusApi";
import { getRecipes } from "api/recipesApi";

import { useMenuForm } from "hooks/useMenuForm";

export const useCreateMenuForm = () => {
    const { t } = useTranslation("menu");
    const navigate = useNavigate();
    const form = useMenuForm({
        errorMessages: {
            emptyTitle: t("createMenuPage.errorTitle"),
            emptyDescription: t("createMenuPage.errorDescription"),
            noCategory: t("createMenuPage.errorCategory"),
            noRecipes: t("createMenuPage.errorRecipes"),
        },
    });

    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [allRecipes, setAllRecipes] = useState<RecipeListItem[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [cats, recipes] = await Promise.all([
                    getMenuCategories(),
                    getRecipes(),
                ]);

                setCategories(cats);
                setAllRecipes(recipes);
            } catch {
                setFetchError(t("createMenuPage.errorLoadData"));
            }
        };

        void load();
    }, [t]);

    const handleSubmit = async () => {
        if (!form.validateForm() || form.selectedCategory === null) {
            return;
        }

        try {
            await createMenu({
                menuTitle: form.menuTitle,
                menuContent: form.menuDescription,
                categoryId: form.selectedCategory,
                recipeIds: form.selectedRecipes,
            });

            navigate(ROUTES.menu);
        } catch {
            setFetchError(t("createMenuPage.errorCreate"));
        }
    };

    return { form, categories, allRecipes, fetchError, handleSubmit };
};
