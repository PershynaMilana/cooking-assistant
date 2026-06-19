import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";
import type { MenuCategory } from "types/menu";
import type { RecipeListItem } from "types/recipe";

import { getMenuCategories } from "api/menuCategoriesApi";
import { getMenuById, updateMenu } from "api/menusApi";
import { getRecipes } from "api/recipesApi";

import { useMenuForm } from "hooks/useMenuForm";

export const useEditMenuForm = (id: string | undefined) => {
    const { t } = useTranslation("menu");
    const navigate = useNavigate();
    const form = useMenuForm({
        errorMessages: {
            emptyTitle: t("changeMenuPage.errorTitle"),
            emptyDescription: t("changeMenuPage.errorDescription"),
            noCategory: t("changeMenuPage.errorCategory"),
            noRecipes: t("changeMenuPage.errorRecipes"),
        },
    });

    const { setInitialValues } = form;
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [allRecipes, setAllRecipes] = useState<RecipeListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        if (!id) {
            setLoading(false);

            return;
        }

        setError(null);
        setLoading(true);
        try {
            const [[cats, recipes], { menu, recipes: menuRecipes }] =
                await Promise.all([
                    Promise.all([getMenuCategories(), getRecipes()]),
                    getMenuById(id),
                ]);

            setCategories(cats);
            setAllRecipes(recipes);
            setInitialValues({
                menuTitle: menu.title || "",
                menuDescription: menu.menucontent || "",
                selectedCategory: menu.categoryid ?? null,
                selectedRecipes: menuRecipes.map((r) => r.id),
            });
        } catch {
            setError(t("changeMenuPage.errorLoadData"));
        }

        setLoading(false);
    }, [id, setInitialValues, t]);

    useEffect(() => {
        void fetchAll();
    }, [fetchAll]);

    const handleSubmit = async () => {
        if (!form.validateForm() || !id) {
            return;
        }

        try {
            await updateMenu(id, {
                menuTitle: form.menuTitle,
                menuContent: form.menuDescription,
                categoryId: form.selectedCategory,
                recipeIds: form.selectedRecipes,
            });

            navigate(ROUTES.menu);
        } catch {
            setError(t("changeMenuPage.errorUpdate"));
        }
    };

    return { form, categories, allRecipes, loading, error, handleSubmit };
};
