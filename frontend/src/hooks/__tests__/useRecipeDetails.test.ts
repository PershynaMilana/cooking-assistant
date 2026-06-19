import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import type { RecipeDetails } from "types/recipe";

import { deleteRecipe, getRecipeById } from "api/recipesApi";

import { useRecipeDetails } from "hooks/useRecipeDetails";

import { getUserIdSafe } from "utils/getCurrentUserId";

import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/recipesApi");
jest.mock("utils/getCurrentUserId");

const OWNER_ID = 3;
const RECIPE: RecipeDetails = {
    id: 1,
    title: "Borscht",
    content: "boil",
    ingredients: [],
    type_id: 2,
    type_name: "Soup",
    cooking_time: 60,
    creation_date: "2024-01-01",
    servings: "4",
    person_id: OWNER_ID,
};

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

describe("useRecipeDetails", () => {
    it("should load the recipe and mark the owner", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(RECIPE);
        jest.mocked(getUserIdSafe).mockReturnValue(OWNER_ID);

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        expect(result.current.recipe).toEqual(RECIPE);
        expect(result.current.isOwner).toBe(true);
    });

    it("should not mark a non-owner as owner", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(RECIPE);
        jest.mocked(getUserIdSafe).mockReturnValue(99);

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        expect(result.current.isOwner).toBe(false);
    });

    it("should set an error when the recipe fails to load", async () => {
        jest.mocked(getRecipeById).mockRejectedValue(new Error("boom"));
        jest.mocked(getUserIdSafe).mockReturnValue(OWNER_ID);

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        expect(result.current.recipe).toBeNull();
        expect(result.current.error).toBe("Error fetching recipe details");
    });

    it("should delete the recipe and navigate to the main page", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(RECIPE);
        jest.mocked(getUserIdSafe).mockReturnValue(OWNER_ID);
        jest.mocked(deleteRecipe).mockResolvedValue(undefined);

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        await act(async () => {
            await result.current.deleteRecipe();
        });

        expect(jest.mocked(deleteRecipe)).toHaveBeenCalledWith("1");
        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });
});
