import i18next from "i18next";
import React from "react";

import type { RecipeWithIngredientNames } from "types/recipe";
import type { RecipeTypeStat } from "types/stats";

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

const t = (key: string) => i18next.t(`stats:${key}`);

export const StatsReport: React.FC<StatsReportProps> = ({
    reportTime,
    stats,
    fastestRecipes,
    slowestRecipes,
    mostIngredientsRecipes,
    leastIngredientsRecipes,
}) => (
    <PdfReportLayout reportTime={reportTime} language={i18next.language}>
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
