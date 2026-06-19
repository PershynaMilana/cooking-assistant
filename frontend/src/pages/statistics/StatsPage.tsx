import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useMenuStatistics } from "hooks/useMenuStatistics";
import { useRecipeStatistics } from "hooks/useRecipeStatistics";

import { Header } from "components/layout/Header";
import { RecipeTypeChart } from "components/stats/RecipeTypeChart";
import { RecipeTypesSummary } from "components/stats/RecipeTypesSummary";
import { ReportDownloadButtons } from "components/stats/ReportDownloadButtons";

import { StatsReport } from "./StatsReport";
import { StatsReportSecond } from "./StatsReportSecond";

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

    const [reportTime, setReportTime] = useState<Date | null>(null);

    const reportData = {
        reportTime: reportTime ?? new Date(),
        stats,
        fastestRecipes,
        slowestRecipes,
        mostIngredientsRecipes,
        leastIngredientsRecipes,
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
                            document1={<StatsReport {...reportData} />}
                            document2={
                                <StatsReportSecond
                                    reportTime={reportTime ?? new Date()}
                                    {...menuStats}
                                />
                            }
                            label1={t("statsPage.downloadReport1")}
                            label2={t("statsPage.downloadReport2")}
                            onGenerate={() => {
                                setReportTime(new Date());
                            }}
                        />
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
