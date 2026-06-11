import { z } from "zod";

import {
    idSchema,
    nonEmptyStringSchema,
    numberSchema,
    positiveIntegerSchema,
} from "./common.schemas";

const recipeIngredientSchema = z.object({
    id: positiveIntegerSchema("Ingredient ID"),
    quantity: numberSchema("Quantity").optional(),
    quantity_recipe_ingredients: numberSchema(
        "Recipe ingredient quantity",
    ).optional(),
});

export const createRecipeSchema = z.object({
    title: nonEmptyStringSchema("Title"),
    content: nonEmptyStringSchema("Content"),
    person_id: idSchema,
    ingredients: z.array(recipeIngredientSchema, {
        required_error: "Ingredients are required",
        invalid_type_error: "Ingredients must be an array",
    }),
    type_id: positiveIntegerSchema("Recipe type ID").optional(),
    cooking_time: positiveIntegerSchema("Cooking time").optional(),
    servings: positiveIntegerSchema("Servings").optional(),
});

export const updateRecipeSchema = createRecipeSchema.omit({
    person_id: true,
});
