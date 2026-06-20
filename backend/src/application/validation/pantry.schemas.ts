import { z } from "zod";

import { numberSchema, positiveIntegerSchema } from "./common.schemas";

const pantryIngredientSchema = z.object({
    id: positiveIntegerSchema("Ingredient ID"),
    quantity_person_ingradient: numberSchema("Quantity")
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
});

export const pantryIngredientsSchema = z
    .array(pantryIngredientSchema, {
        required_error: "Incorrect data format",
        invalid_type_error: "Incorrect data format",
    })
    .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        { message: "Ingredient IDs must be unique" },
    );

const pantryUpdateIngredientSchema = z.object({
    id: positiveIntegerSchema("Ingredient ID"),
    quantity_person_ingradient: numberSchema("Quantity")
        .int("Quantity must be an integer")
        .min(0, "Quantity must be 0 or more"),
});

export const pantryUpdateIngredientsSchema = z
    .array(pantryUpdateIngredientSchema, {
        required_error: "Incorrect data format",
        invalid_type_error: "Incorrect data format",
    })
    .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        { message: "Ingredient IDs must be unique" },
    );

export const purchaseQuantitySchema = z
    .number({
        required_error: "Quantity cannot be empty.",
        invalid_type_error: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1");
