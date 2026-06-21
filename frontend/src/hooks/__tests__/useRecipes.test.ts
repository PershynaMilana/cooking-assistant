import { act, renderHook } from "@testing-library/react";

import type { RecipeFilterParams, RecipeListItem } from "types/recipe";

import { useRecipes } from "hooks/useRecipes";

import { MOCK_ERROR_NETWORK } from "test/constants";

const BASE_PARAMS: RecipeFilterParams = {
    ingredient_name: "",
    sort_order: "asc",
};

const RECIPE_A: RecipeListItem = {
    id: 1,
    title: "Borscht",
    type_name: "Soup",
    creation_date: "2024-01-01",
    cooking_time: 60,
};

const RECIPE_B: RecipeListItem = {
    id: 2,
    title: "Varenyky",
    type_name: "Main",
    creation_date: "2024-01-02",
    cooking_time: 30,
};

describe("useRecipes", () => {
    it("should fetch and sort recipes ascending by cooking time", async () => {
        const fetcher = jest.fn().mockResolvedValue([RECIPE_A, RECIPE_B]);
        const { result } = renderHook(() => useRecipes(fetcher));

        await act(async () => {
            await result.current.fetchRecipes(BASE_PARAMS, "asc");
        });

        expect(result.current.recipes[0].id).toBe(2);
        expect(result.current.recipes[1].id).toBe(1);
        expect(result.current.noRecipes).toBe(false);
    });

    it("should sort recipes descending by cooking time", async () => {
        const fetcher = jest.fn().mockResolvedValue([RECIPE_B, RECIPE_A]);
        const { result } = renderHook(() => useRecipes(fetcher));

        await act(async () => {
            await result.current.fetchRecipes(BASE_PARAMS, "desc");
        });

        expect(result.current.recipes[0].id).toBe(1);
        expect(result.current.recipes[1].id).toBe(2);
    });

    it("should break ascending ties by title", async () => {
        const sameTimeFirst: RecipeListItem = {
            ...RECIPE_B,
            title: "Zucchini",
        };
        const sameTimeSecond: RecipeListItem = {
            ...RECIPE_A,
            cooking_time: 30,
        };
        const fetcher = jest
            .fn()
            .mockResolvedValue([sameTimeFirst, sameTimeSecond]);
        const { result } = renderHook(() => useRecipes(fetcher));

        await act(async () => {
            await result.current.fetchRecipes(BASE_PARAMS, "asc");
        });

        expect(result.current.recipes[0].title).toBe("Borscht");
        expect(result.current.recipes[1].title).toBe("Zucchini");
    });

    it("should break descending ties by title", async () => {
        const sameTimeFirst: RecipeListItem = {
            ...RECIPE_B,
            title: "Zucchini",
        };
        const sameTimeSecond: RecipeListItem = {
            ...RECIPE_A,
            cooking_time: 30,
        };
        const fetcher = jest
            .fn()
            .mockResolvedValue([sameTimeFirst, sameTimeSecond]);
        const { result } = renderHook(() => useRecipes(fetcher));

        await act(async () => {
            await result.current.fetchRecipes(BASE_PARAMS, "desc");
        });

        expect(result.current.recipes[0].title).toBe("Borscht");
        expect(result.current.recipes[1].title).toBe("Zucchini");
    });

    it("should set noRecipes when api returns empty array", async () => {
        const fetcher = jest.fn().mockResolvedValue([]);
        const { result } = renderHook(() => useRecipes(fetcher));

        await act(async () => {
            await result.current.fetchRecipes(BASE_PARAMS, "asc");
        });

        expect(result.current.noRecipes).toBe(true);
        expect(result.current.recipes).toHaveLength(0);
    });

    it("should set error message when api throws", async () => {
        const fetcher = jest
            .fn()
            .mockRejectedValue(new Error(MOCK_ERROR_NETWORK));
        const { result } = renderHook(() => useRecipes(fetcher));

        await act(async () => {
            await result.current.fetchRecipes(BASE_PARAMS, "asc");
        });

        expect(result.current.error).toBe(MOCK_ERROR_NETWORK);
    });
});
