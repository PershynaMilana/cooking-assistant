import { Text, View } from "@react-pdf/renderer";
import React from "react";
import { useTranslation } from "react-i18next";

import type { RecipeWithIngredientNames } from "types/recipe";

import { reportStyles } from "./reportStyles";

interface PdfRecipeListProps {
    title: string;
    recipes: RecipeWithIngredientNames[];
    variant: "time" | "ingredients";
}

export const PdfRecipeList: React.FC<PdfRecipeListProps> = ({
    title,
    recipes,
    variant,
}) => {
    const { t } = useTranslation("stats");

    return (
        <View style={reportStyles.section}>
            <Text style={reportStyles.subtitle}>{title}</Text>
            {recipes.map((recipe) => (
                <Text key={recipe.id} style={reportStyles.listItem}>
                    {variant === "time"
                        ? `${recipe.title} (${recipe.cooking_time}${t("statsReport.cookingTimeUnit")})`
                        : `${recipe.title} (${recipe.ingredients.length}${t("statsReport.ingredientsUnit")})`}
                </Text>
            ))}
        </View>
    );
};
