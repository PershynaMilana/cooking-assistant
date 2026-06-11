import { z } from "zod";

import {
    idSchema,
    nonEmptyStringSchema,
    optionalStringSchema,
    positiveIntegerSchema,
} from "./common.schemas";

const recipeIdSchema = positiveIntegerSchema("Recipe ID");

export const createMenuSchema = z.object({
    menuTitle: nonEmptyStringSchema("Menu title"),
    menuContent: optionalStringSchema("Menu content"),
    categoryId: positiveIntegerSchema("Category ID"),
    personId: idSchema,
    recipeIds: z.array(recipeIdSchema, {
        required_error: "Recipe IDs are required",
        invalid_type_error: "Recipe IDs must be an array",
    }),
});

export const updateMenuSchema = createMenuSchema.omit({
    personId: true,
});
