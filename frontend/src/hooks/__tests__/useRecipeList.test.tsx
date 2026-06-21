import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import type { RecipeListItem } from "types/recipe";

import { getRecipeTypes } from "api/recipeTypesApi";

import { useRecipeList } from "hooks/useRecipeList";

import { flushMicrotasks as flush } from "test/flush";

jest.mock("api/recipeTypesApi");

const RECIPES: RecipeListItem[] = [
    {
        id: 1,
        title: "Borscht",
        type_name: "Soup",
        creation_date: "2024-01-01",
        cooking_time: 60,
    },
];

const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
);

describe("useRecipeList", () => {
    it("should load recipes from the fetcher", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue([]);
        const fetcher = jest.fn().mockResolvedValue(RECIPES);

        const { result } = renderHook(() => useRecipeList(fetcher), {
            wrapper,
        });

        await flush();

        expect(result.current.recipes).toHaveLength(1);
        expect(result.current.noRecipes).toBe(false);
    });

    it("should flag noRecipes for an empty result", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue([]);
        const fetcher = jest.fn().mockResolvedValue([]);

        const { result } = renderHook(() => useRecipeList(fetcher), {
            wrapper,
        });

        await flush();

        expect(result.current.noRecipes).toBe(true);
    });

    it("should expose an error when the fetcher rejects", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue([]);
        const fetcher = jest.fn().mockRejectedValue(new Error("network"));

        const { result } = renderHook(() => useRecipeList(fetcher), {
            wrapper,
        });

        await flush();

        expect(result.current.error).toBeTruthy();
    });
});
