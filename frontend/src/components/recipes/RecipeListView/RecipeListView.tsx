import React from "react";
import { useTranslation } from "react-i18next";

import { PAGE_SIZE } from "constants/pagination";
import type { RecipeListItem } from "types/recipe";
import type { RecipeTypeSummary } from "types/recipeType";

import type { RecipeFilterState } from "hooks/useRecipeListView";

import { ListPageLayout } from "components/layout/ListPageLayout";
import { RecipeCard } from "components/recipes/RecipeCard";
import { RecipeFilterPanel } from "components/recipes/RecipeFilterPanel";
import { RecipeTypeDescriptions } from "components/recipes/RecipeTypeDescriptions";
import { LoadMore } from "components/ui/LoadMore";

interface RecipeListViewProps {
    filters: RecipeFilterState;
    setSelectedTypes: (types: number[]) => void;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    setMinCookingTime: (time: string) => void;
    setMaxCookingTime: (time: string) => void;
    setSortOrder: (order: string) => void;
    types: RecipeTypeSummary[];
    recipes: RecipeListItem[];
    noRecipes: boolean;
    error: string | null;
    descriptions: RecipeTypeSummary[];
    heading: string;
    emptyMessage: string;
    searchPlaceholder: string;
    actionSlot?: React.ReactNode;
    total: number;
    loadedCount: number;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    loadMoreError: string | null;
}

export const RecipeListView: React.FC<RecipeListViewProps> = ({
    filters,
    setSelectedTypes,
    setStartDate,
    setEndDate,
    setMinCookingTime,
    setMaxCookingTime,
    setSortOrder,
    types,
    recipes,
    noRecipes,
    error,
    descriptions,
    heading,
    emptyMessage,
    searchPlaceholder,
    actionSlot,
    total,
    loadedCount,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreError,
}) => {
    const { t } = useTranslation();

    return (
        <ListPageLayout
            filterSlot={
                <RecipeFilterPanel
                    filters={filters}
                    setSelectedTypes={setSelectedTypes}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    setMinCookingTime={setMinCookingTime}
                    setMaxCookingTime={setMaxCookingTime}
                    setSortOrder={setSortOrder}
                    types={types}
                    searchPlaceholder={searchPlaceholder}
                />
            }
            actionSlot={actionSlot}
            heading={heading}
            afterHeading={
                <RecipeTypeDescriptions descriptions={descriptions} />
            }
            isEmpty={noRecipes}
            emptyMessage={emptyMessage}
            error={error}
            footerSlot={
                <LoadMore
                    hasMore={hasNextPage}
                    isLoading={isFetchingNextPage}
                    onLoadMore={fetchNextPage}
                    loadMoreLabel={t("loadMore.button")}
                    loadingLabel={t("loadMore.loading")}
                    countLabel={
                        total > PAGE_SIZE
                            ? t("loadMore.showing", {
                                  loaded: loadedCount,
                                  total,
                              })
                            : undefined
                    }
                    errorMessage={loadMoreError ?? undefined}
                />
            }
        >
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe.id}
                    id={recipe.id}
                    title={recipe.title}
                    typeName={recipe.type_name}
                    creationDate={recipe.creation_date}
                    cookingTime={recipe.cooking_time}
                />
            ))}
        </ListPageLayout>
    );
};
