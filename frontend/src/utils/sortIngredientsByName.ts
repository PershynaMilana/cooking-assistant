import type { Ingredient } from "types/ingredient";

// alphabetical ordering preserved from the old data hooks; the recipe form
// sorted with the uk locale, the pantry with the default locale
export const sortIngredientsByName = (
    ingredients: Ingredient[],
    locale?: string,
): Ingredient[] =>
    [...ingredients].sort((a, b) => a.name.localeCompare(b.name, locale));
