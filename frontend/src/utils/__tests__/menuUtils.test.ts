import type { MenuDetailRecipe } from "types/menu";

import {
    aggregateMissingIngredients,
    groupRecipesByType,
} from "utils/menuUtils";

const makeRecipe = (
    id: number,
    type_name: string,
    missingIngredients?: MenuDetailRecipe["missingIngredients"],
): MenuDetailRecipe =>
    ({
        id,
        title: `Recipe ${id}`,
        type_name,
        missingIngredients,
    }) as MenuDetailRecipe;

describe("groupRecipesByType", () => {
    it("should return an empty object for an empty list", () => {
        expect(groupRecipesByType([])).toEqual({});
    });

    it("should group recipes with the same type_name together", () => {
        const recipes = [
            makeRecipe(1, "Soup"),
            makeRecipe(2, "Soup"),
            makeRecipe(3, "Salad"),
        ];

        const result = groupRecipesByType(recipes);

        expect(result.Soup).toHaveLength(2);
        expect(result.Salad).toHaveLength(1);
    });

    it("should create a separate group for each distinct type", () => {
        const recipes = [
            makeRecipe(1, "A"),
            makeRecipe(2, "B"),
            makeRecipe(3, "C"),
        ];

        expect(Object.keys(groupRecipesByType(recipes))).toHaveLength(3);
    });

    it("should preserve the original recipe objects in each group", () => {
        const recipe = makeRecipe(99, "Soup");
        const result = groupRecipesByType([recipe]);

        expect(result.Soup[0]).toBe(recipe);
    });
});

describe("aggregateMissingIngredients", () => {
    it("should return an empty object for an empty list", () => {
        expect(aggregateMissingIngredients([])).toEqual({});
    });

    it("should return an empty object when no recipe has missing ingredients", () => {
        const recipes = [makeRecipe(1, "Soup", []), makeRecipe(2, "Salad", [])];

        expect(aggregateMissingIngredients(recipes)).toEqual({});
    });

    it("should handle recipes where missingIngredients is undefined", () => {
        const recipe = makeRecipe(1, "Soup");

        expect(aggregateMissingIngredients([recipe])).toEqual({});
    });

    it("should aggregate missing quantities for the same ingredient across recipes", () => {
        const recipes = [
            makeRecipe(1, "Soup", [
                {
                    ingredient_name: "Flour",
                    missing_quantity: 100,
                    unit_name: "g",
                },
            ]),
            makeRecipe(2, "Bread", [
                {
                    ingredient_name: "Flour",
                    missing_quantity: 200,
                    unit_name: "g",
                },
            ]),
        ];

        const result = aggregateMissingIngredients(recipes);

        expect(result.Flour.quantity).toBe(300);
        expect(result.Flour.unit).toBe("g");
    });

    it("should keep separate entries for different ingredients", () => {
        const recipes = [
            makeRecipe(1, "Soup", [
                {
                    ingredient_name: "Salt",
                    missing_quantity: 5,
                    unit_name: "g",
                },
                {
                    ingredient_name: "Pepper",
                    missing_quantity: 2,
                    unit_name: "g",
                },
            ]),
        ];

        const result = aggregateMissingIngredients(recipes);

        expect(result.Salt.quantity).toBe(5);
        expect(result.Pepper.quantity).toBe(2);
    });

    it("should use the unit from the first occurrence of each ingredient", () => {
        const recipes = [
            makeRecipe(1, "A", [
                {
                    ingredient_name: "Sugar",
                    missing_quantity: 10,
                    unit_name: "g",
                },
            ]),
            makeRecipe(2, "B", [
                {
                    ingredient_name: "Sugar",
                    missing_quantity: 5,
                    unit_name: "cups",
                },
            ]),
        ];

        const result = aggregateMissingIngredients(recipes);

        expect(result.Sugar.unit).toBe("g");
        expect(result.Sugar.quantity).toBe(15);
    });
});
