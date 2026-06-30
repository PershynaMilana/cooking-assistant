import { Text, View } from "@react-pdf/renderer";
import i18next from "i18next";
import React from "react";

import type { RecipeWithIngredientNames } from "types/recipe";

import { reportStyles } from "./reportStyles";

interface PdfRecipeListProps {
    title: string;
    recipes: RecipeWithIngredientNames[];
    variant: "time" | "ingredients";
}

const t = (key: string) => i18next.t(`stats:${key}`);

export const PdfRecipeList: React.FC<PdfRecipeListProps> = ({
    title,
    recipes,
    variant,
}) => (
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
