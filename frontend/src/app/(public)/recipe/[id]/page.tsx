import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { recipeDetailsPath } from "constants/routes";
import type { RecipeDetails } from "types/recipe";

import { API_ROUTES } from "api/endpoints";
import { fetchAsVisitor } from "api/server";

import { DEFAULT_LANGUAGE } from "i18n/resources";
import { getServerTranslation } from "i18n/server";

import { toMetaDescription } from "utils/metaDescription";

import { RecipeDetailsView } from "./RecipeDetailsView";

const NAMESPACE = "recipes";

interface RecipePageProps {
    params: Promise<{ id: string }>;
}

// generateMetadata and the page itself both need the recipe; cache() makes that one request
const loadRecipe = cache(async (id: string): Promise<RecipeDetails | null> =>
    fetchAsVisitor<RecipeDetails>(API_ROUTES.recipes.byId(id)),
);

export const generateMetadata = async ({
    params,
}: RecipePageProps): Promise<Metadata> => {
    const { id } = await params;
    const recipe = await loadRecipe(id);

    if (!recipe) {
        return {};
    }

    const t = await getServerTranslation(DEFAULT_LANGUAGE, NAMESPACE);
    // a recipe whose type was deleted has none: the FK is ON DELETE SET NULL
    const fallbackKey =
        recipe.type_name === null
            ? "recipeDetailsPage.metaFallbackDescriptionUntyped"
            : "recipeDetailsPage.metaFallbackDescription";
    const description = toMetaDescription(
        recipe.content,
        t(fallbackKey, {
            type: recipe.type_name?.toLowerCase(),
            count: recipe.ingredients.length,
        }),
    );
    const url = recipeDetailsPath(recipe.id);

    return {
        title: recipe.title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            url,
            title: recipe.title,
            description,
        },
        twitter: { title: recipe.title, description },
    };
};

const RecipeDetailsPage = async ({ params }: RecipePageProps) => {
    const { id } = await params;
    const recipe = await loadRecipe(id);

    if (!recipe) {
        notFound();
    }

    return <RecipeDetailsView recipe={recipe} />;
};

export default RecipeDetailsPage;
