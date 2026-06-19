import type { MenuDetailRecipe, MissingIngredient } from "types/menu";

export interface AggregatedIngredient {
    quantity: number;
    unit: string;
}

export const groupRecipesByType = (
    recipes: MenuDetailRecipe[],
): Record<string, MenuDetailRecipe[]> =>
    recipes.reduce((groups: Record<string, MenuDetailRecipe[]>, recipe) => {
        const { type_name } = recipe;

        if (!(type_name in groups)) {
            groups[type_name] = [];
        }
        groups[type_name].push(recipe);

        return groups;
    }, {});

export const aggregateMissingIngredients = (
    recipes: MenuDetailRecipe[],
): Record<string, AggregatedIngredient> =>
    recipes
        .flatMap((recipe) => recipe.missingIngredients ?? [])
        .reduce(
            (
                acc: Record<string, AggregatedIngredient>,
                ingredient: MissingIngredient,
            ) => {
                const { ingredient_name, missing_quantity, unit_name } =
                    ingredient;

                if (!(ingredient_name in acc)) {
                    acc[ingredient_name] = {
                        quantity: missing_quantity,
                        unit: unit_name,
                    };
                } else {
                    acc[ingredient_name].quantity += missing_quantity;
                }

                return acc;
            },
            {},
        );
