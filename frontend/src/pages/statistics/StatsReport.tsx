import React from "react";
import { useTranslation } from "react-i18next";

import type { RecipeWithIngredientNames } from "types/recipe";

import type { RecipeTypeStat } from "hooks/useRecipeStatistics";

import { PdfRecipeList } from "./PdfRecipeList";
import { PdfReportLayout } from "./PdfReportLayout";
import { PdfStatList } from "./PdfStatList";

interface StatsReportProps {
    reportTime: Date;
    stats: RecipeTypeStat[];
    fastestRecipes: RecipeWithIngredientNames[];
    slowestRecipes: RecipeWithIngredientNames[];
    mostIngredientsRecipes: RecipeWithIngredientNames[];
    leastIngredientsRecipes: RecipeWithIngredientNames[];
}

export const StatsReport: React.FC<StatsReportProps> = ({
    reportTime,
    stats,
    fastestRecipes,
    slowestRecipes,
    mostIngredientsRecipes,
    leastIngredientsRecipes,
}) => {
    const { t, i18n } = useTranslation("stats");

    return (
        <PdfReportLayout reportTime={reportTime} language={i18n.language}>
            <PdfStatList
                title={t("statsReport.recipeTypes")}
                items={stats.map((s) => ({
                    label: s.typeName,
                    value: s.count,
                }))}
            />
            <PdfRecipeList
                title={t("statsReport.fastestRecipes")}
                recipes={fastestRecipes}
                variant="time"
            />
            <PdfRecipeList
                title={t("statsReport.slowestRecipes")}
                recipes={slowestRecipes}
                variant="time"
            />
            <PdfRecipeList
                title={t("statsReport.mostIngredients")}
                recipes={mostIngredientsRecipes}
                variant="ingredients"
            />
            <PdfRecipeList
                title={t("statsReport.leastIngredients")}
                recipes={leastIngredientsRecipes}
                variant="ingredients"
            />
        </PdfReportLayout>
    );
};
