import type { z } from "zod";

import type { recipeFiltersSchema } from "application/validation/recipe.schemas";

export type RecipeFilters = z.infer<typeof recipeFiltersSchema>;
