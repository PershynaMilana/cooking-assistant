import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useMenuStatistics } from "hooks/useMenuStatistics";
import { useRecipeStatistics } from "hooks/useRecipeStatistics";

import { Header } from "components/layout/Header";
import { RecipeTypeChart } from "components/stats/RecipeTypeChart";
import { RecipeTypesSummary } from "components/stats/RecipeTypesSummary";
import { ReportDownloadButtons } from "components/stats/ReportDownloadButtons";

const StatsPage: React.FC = () => {
    const { t } = useTranslation("stats");
    const {
        stats,
        recipesCount,
        fastestRecipes,
        slowestRecipes,
        mostIngredientsRecipes,
        leastIngredientsRecipes,
    } = useRecipeStatistics();
    const menuStats = useMenuStatistics(recipesCount);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const triggerDownload = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownload1 = async () => {
        setDownloadError(null);
        try {
            const [{ pdf }, { StatsReport }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("./StatsReport"),
            ]);
            const reportTime = new Date();
            const blob = await pdf(
                <StatsReport
                    reportTime={reportTime}
                    stats={stats}
                    fastestRecipes={fastestRecipes}
                    slowestRecipes={slowestRecipes}
                    mostIngredientsRecipes={mostIngredientsRecipes}
                    leastIngredientsRecipes={leastIngredientsRecipes}
                />,
            ).toBlob();

            triggerDownload(blob, "Statistics_Report.pdf");
        } catch {
            setDownloadError("Failed to generate report. Please try again.");
        }
    };

    const handleDownload2 = async () => {
        setDownloadError(null);
        try {
            const [{ pdf }, { StatsReportSecond }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("./StatsReportSecond"),
            ]);
            const reportTime = new Date();
            const blob = await pdf(
                <StatsReportSecond
                    reportTime={reportTime}
                    menusCount={menuStats.menusCount}
                    recipesCount={menuStats.recipesCount}
                    averageCookingTimes={menuStats.averageCookingTimes}
                    menuCountByCategory={menuStats.menuCountByCategory}
                    error={menuStats.error}
                />,
            ).toBlob();

            triggerDownload(blob, "Statistics_Second_Report.pdf");
        } catch {
            setDownloadError("Failed to generate report. Please try again.");
        }
    };

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
