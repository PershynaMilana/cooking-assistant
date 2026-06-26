import type { RecipeListItem } from "types/recipe";

// client-side ordering preserved from the old useRecipes: by cooking time
// (asc/desc) with the title as a stable tiebreaker
export const sortRecipes = (
    recipes: RecipeListItem[],
    sortOrder: string,
): RecipeListItem[] =>
    [...recipes].sort((a, b) => {
        if (sortOrder === "asc") {
            return (
                a.cooking_time - b.cooking_time ||
                a.title.localeCompare(b.title)
            );
        }

        return (
            b.cooking_time - a.cooking_time || a.title.localeCompare(b.title)
        );
    });
