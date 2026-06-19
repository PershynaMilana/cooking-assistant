import { act, renderHook } from "@testing-library/react";

import type { RecipeWithIngredientNames } from "types/recipe";

import { getRecipes } from "api/recipesApi";

import { useRecipeStatistics } from "hooks/useRecipeStatistics";

jest.mock("api/recipesApi");

const SAMPLE: RecipeWithIngredientNames[] = [
    {
        id: 1,
        title: "Borscht",
        type_name: "Soup",
        creation_date: "2024-01-01",
        cooking_time: 60,
        ingredients: ["beet", "potato"],
    },
    {
        id: 2,
        title: "Varenyky",
        type_name: "Main",
        creation_date: "2024-01-02",
        cooking_time: 30,
        ingredients: ["flour"],
    },
];

describe("useRecipeStatistics", () => {
    it("should compute type counts from recipes", async () => {
        jest.mocked(getRecipes).mockResolvedValue(SAMPLE);

        const { result } = renderHook(() => useRecipeStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.stats).toHaveLength(2);
        expect(
            result.current.stats.find((s) => s.typeName === "Soup")?.count,
        ).toBe(1);
    });

    it("should identify fastest and slowest recipes", async () => {
        jest.mocked(getRecipes).mockResolvedValue(SAMPLE);

        const { result } = renderHook(() => useRecipeStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.fastestRecipes[0].id).toBe(2);
        expect(result.current.slowestRecipes[0].id).toBe(1);
    });

    it("should identify most and least ingredients recipes", async () => {
        jest.mocked(getRecipes).mockResolvedValue(SAMPLE);

        const { result } = renderHook(() => useRecipeStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.mostIngredientsRecipes[0].id).toBe(1);
        expect(result.current.leastIngredientsRecipes[0].id).toBe(2);
    });

    it("should return empty arrays when recipe list is empty", async () => {
        jest.mocked(getRecipes).mockResolvedValue([]);

        const { result } = renderHook(() => useRecipeStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.stats).toHaveLength(0);
        expect(result.current.fastestRecipes).toHaveLength(0);
        expect(result.current.slowestRecipes).toHaveLength(0);
        expect(result.current.mostIngredientsRecipes).toHaveLength(0);
        expect(result.current.leastIngredientsRecipes).toHaveLength(0);
    });

    it("should include all recipes tied for the same extreme cooking time", async () => {
        const TIED: RecipeWithIngredientNames[] = [
            {
                id: 10,
                title: "Fast A",
                type_name: "Soup",
                creation_date: "2024-01-01",
                cooking_time: 10,
                ingredients: ["a"],
            },
            {
                id: 11,
                title: "Fast B",
                type_name: "Soup",
                creation_date: "2024-01-02",
                cooking_time: 10,
                ingredients: ["b"],
            },
            {
                id: 12,
                title: "Slow",
                type_name: "Main",
                creation_date: "2024-01-03",
                cooking_time: 90,
                ingredients: ["c"],
            },
        ];

        jest.mocked(getRecipes).mockResolvedValue(TIED);

        const { result } = renderHook(() => useRecipeStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.fastestRecipes).toHaveLength(2);
        expect(result.current.fastestRecipes.map((r) => r.id)).toContain(10);
        expect(result.current.fastestRecipes.map((r) => r.id)).toContain(11);
    });
});
