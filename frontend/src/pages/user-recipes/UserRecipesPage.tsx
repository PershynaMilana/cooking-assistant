import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "constants/routes";

import { getRecipesByPerson } from "api/recipesApi";

import { useRecipeList } from "hooks/useRecipeList";

import { RecipeListView } from "components/recipes/RecipeListView";

import { getCurrentUserId } from "utils/getCurrentUserId";

const UserRecipesPage: React.FC = () => {
    const { t } = useTranslation("recipes");

    const userId = getCurrentUserId();

    const fetcher = useCallback(
        (params: Parameters<typeof getRecipesByPerson>[1]) => {
            if (userId === null) {
                console.error("No auth token found.");

                return Promise.resolve([]);
            }

            return getRecipesByPerson(userId, params);
        },
        [userId],
    );

    const list = useRecipeList(fetcher);

    const heading =
        list.filters.selectedTypes.length > 0
            ? t("userRecipesPage.recipesBy", { types: list.typesHeader })
            : t("userRecipesPage.myRecipes");

    const emptyMessage =
        list.filters.selectedTypes.length > 0
            ? t("userRecipesPage.noRecipesType")
            : t("userRecipesPage.createFirst");

    const addRecipeLink = (
        <Link
            to={ROUTES.addRecipe}
            className="flex items-center justify-center font-montserratRegular-normal text-almost-white bg-purple-700 p-4 w-15 m-7 rounded-3xl"
        >
            {t("userRecipesPage.addRecipe")}
        </Link>
    );

    return (
        <RecipeListView
            {...list}
            heading={heading}
            emptyMessage={emptyMessage}
            searchPlaceholder={t("userRecipesPage.searchPlaceholder")}
            actionSlot={addRecipeLink}
        />
    );
};

export default UserRecipesPage;
