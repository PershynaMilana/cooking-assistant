import React from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "redux/hooks";
import {
    selectMenuStatistics,
    selectRecipeStatistics,
} from "redux/selectors/statisticsSelectors";
import { useGetAllMenusQuery } from "redux/services/menusApi";
import { useGetAllRecipesQuery } from "redux/services/recipesApi";

import { AppShell } from "components/layout/AppShell";
import { MenuCategoryChart } from "components/stats/MenuCategoryChart";
import { MenuStatsSummary } from "components/stats/MenuStatsSummary";
import { RecipeTypeChart } from "components/stats/RecipeTypeChart";
import { RecipeTypesSummary } from "components/stats/RecipeTypesSummary";

const CARD_CLASSNAME =
    "bg-white p-6 rounded-lg shadow-lg border border-gray-200";

const StatsPage: React.FC = () => {
    const { t } = useTranslation("stats");

    useGetAllRecipesQuery(null);
    useGetAllMenusQuery(null);
    const {
        stats,
        fastestRecipes,
        slowestRecipes,
        mostIngredientsRecipes,
        leastIngredientsRecipes,
    } = useAppSelector(selectRecipeStatistics);
    const menuStats = useAppSelector(selectMenuStatistics);

    return (
        <AppShell>
            <div className="mx-[15vw] my-8">
                <h1 className="text-relative-h3 font-bold text-center bg-gradient-to-r from-dark-purple to-perfect-purple text-white p-4 rounded-md mb-8">
                    {t("statsPage.heading")}
                </h1>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                        <div
                            className={`${CARD_CLASSNAME} flex items-center justify-center`}
                        >
                            <RecipeTypeChart stats={stats} />
                        </div>

                        <div className={CARD_CLASSNAME}>
                            <RecipeTypesSummary
                                stats={stats}
                                fastestRecipes={fastestRecipes.slice(0, 3)}
                                slowestRecipes={slowestRecipes.slice(0, 3)}
                                mostIngredientsRecipes={mostIngredientsRecipes.slice(
                                    0,
                                    3,
                                )}
                                leastIngredientsRecipes={leastIngredientsRecipes.slice(
                                    0,
                                    3,
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                        <div
                            className={`${CARD_CLASSNAME} flex items-center justify-center`}
                        >
                            <MenuCategoryChart
                                categories={menuStats.menuCountByCategory}
                            />
                        </div>

                        <div className={CARD_CLASSNAME}>
                            <MenuStatsSummary
                                menusCount={menuStats.menusCount}
                                recipesCount={menuStats.recipesCount}
                                averageCookingTimes={
                                    menuStats.averageCookingTimes
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
};

export default StatsPage;
