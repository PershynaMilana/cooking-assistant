import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "redux/hooks";
import {
    selectMenuStatistics,
    selectRecipeStatistics,
} from "redux/selectors/statisticsSelectors";
import { useGetMenusQuery } from "redux/services/menusApi";
import { useGetAllRecipesQuery } from "redux/services/recipesApi";

import { Header } from "components/layout/Header";
import { RecipeTypeChart } from "components/stats/RecipeTypeChart";
import { RecipeTypesSummary } from "components/stats/RecipeTypesSummary";
import { ReportDownloadButtons } from "components/stats/ReportDownloadButtons";

import { getQueryErrorMessage } from "utils/queryError";
import { triggerDownload } from "utils/triggerDownload";

// stable arg so the menu cache key matches the statistics selector's
const ALL_MENUS_PARAMS = {};

const StatsPage: React.FC = () => {
    const { t } = useTranslation("stats");
    const recipesQuery = useGetAllRecipesQuery(null);
    const menusQuery = useGetMenusQuery(ALL_MENUS_PARAMS);
    const {
        stats,
        fastestRecipes,
        slowestRecipes,
        mostIngredientsRecipes,
        leastIngredientsRecipes,
    } = useAppSelector(selectRecipeStatistics);
    const menuStats = useAppSelector(selectMenuStatistics);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const queryError = menusQuery.error ?? recipesQuery.error;
    const statsError = queryError ? getQueryErrorMessage(queryError) : null;

    const runDownload = async (
        build: () => Promise<Blob>,
        filename: string,
    ) => {
        setDownloadError(null);
        try {
            triggerDownload(await build(), filename);
        } catch {
            setDownloadError(t("statsPage.reportError"));
        }
    };

    const handleDownload1 = () =>
        runDownload(async () => {
            const [{ pdf }, { StatsReport }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("./StatsReport"),
            ]);

            return pdf(
                <StatsReport
                    reportTime={new Date()}
                    stats={stats}
                    fastestRecipes={fastestRecipes}
                    slowestRecipes={slowestRecipes}
                    mostIngredientsRecipes={mostIngredientsRecipes}
                    leastIngredientsRecipes={leastIngredientsRecipes}
                />,
            ).toBlob();
        }, "Statistics_Report.pdf");

    const handleDownload2 = () =>
        runDownload(async () => {
            const [{ pdf }, { StatsReportSecond }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("./StatsReportSecond"),
            ]);

            return pdf(
                <StatsReportSecond
                    reportTime={new Date()}
                    menusCount={menuStats.menusCount}
                    recipesCount={menuStats.recipesCount}
                    averageCookingTimes={menuStats.averageCookingTimes}
                    menuCountByCategory={menuStats.menuCountByCategory}
                    error={statsError}
                />,
            ).toBlob();
        }, "Statistics_Second_Report.pdf");

    return (
        <div>
            <Header />
            <div className="mx-[15vw] my-8">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="text-relative-h3 font-bold text-center bg-gradient-to-r from-dark-purple to-perfect-purple text-white p-4 rounded-md">
                        {t("statsPage.heading")}
                    </h1>
                </div>

                <div className="flex justify-between">
                    <div className="bg-white p-6 h-full rounded-xl shadow-lg border border-gray-200">
                        <RecipeTypeChart stats={stats} />
                        <ReportDownloadButtons
                            label1={t("statsPage.downloadReport1")}
                            label2={t("statsPage.downloadReport2")}
                            onDownload1={handleDownload1}
                            onDownload2={handleDownload2}
                        />
                        {downloadError !== null && (
                            <p className="text-red-500 text-sm mt-2">
                                {downloadError}
                            </p>
                        )}
                    </div>

                    <RecipeTypesSummary
                        stats={stats}
                        fastestRecipes={fastestRecipes}
                        slowestRecipes={slowestRecipes}
                        mostIngredientsRecipes={mostIngredientsRecipes}
                        leastIngredientsRecipes={leastIngredientsRecipes}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
