import React from "react";
import { useTranslation } from "react-i18next";

import { getRecipesByFilters } from "api/recipesApi";

import { useRecipeList } from "hooks/useRecipeList";

import { RecipeListView } from "components/recipes/RecipeListView";

const MainPage: React.FC = () => {
    const { t } = useTranslation("recipes");
    const list = useRecipeList(getRecipesByFilters);

    const heading =
        list.filters.selectedTypes.length > 0
            ? t("mainPage.recipesBy", { types: list.typesHeader })
            : t("mainPage.allRecipes");

    const emptyMessage =
        list.filters.selectedTypes.length > 0
            ? t("mainPage.noSuchRecipes")
            : t("mainPage.createFirst");

    return (
        <RecipeListView
            {...list}
            heading={heading}
            emptyMessage={emptyMessage}
            searchPlaceholder={t("mainPage.searchPlaceholder")}
        />
    );
};

export default MainPage;
