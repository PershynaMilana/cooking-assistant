import { z } from "zod";

import { numberSchema, positiveIntegerSchema } from "./common.schemas";

const pantryIngredientSchema = z.object({
    id: positiveIntegerSchema("Ingredient ID"),
    quantity_person_ingradient: numberSchema("Quantity").min(
        1,
        "Quantity must be at least 1",
    ),
});

export const pantryIngredientsSchema = z.array(pantryIngredientSchema, {
    required_error: "Incorrect data format",
    invalid_type_error: "Incorrect data format",
});

export const purchaseQuantitySchema = z
    .number({
        required_error: "Quantity cannot be empty.",
        invalid_type_error: "Quantity must be a number",
    })
    .min(1, "Quantity must be at least 1");
