import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import type { RecipeDetails } from "types/recipe";

import { deleteRecipe, getRecipeById } from "api/recipesApi";

import { useRecipeDetails } from "hooks/useRecipeDetails";

import { flushMicrotasks as flush } from "test/flush";
import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/recipesApi");

const RECIPE: RecipeDetails = {
    id: 1,
    title: "Borscht",
    content: "boil",
    ingredients: [],
    type_id: 2,
    type_name: "Soup",
    cooking_time: 60,
    creation_date: "2024-01-01",
    servings: 4,
    person_id: 3,
    isOwner: true,
};

describe("useRecipeDetails", () => {
    it("should load the recipe and mark the owner from the backend flag", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(RECIPE);

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        expect(result.current.recipe).toEqual(RECIPE);
        expect(result.current.isOwner).toBe(true);
    });

    it("should not mark a non-owner as owner", async () => {
        jest.mocked(getRecipeById).mockResolvedValue({
            ...RECIPE,
            isOwner: false,
        });

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        expect(result.current.isOwner).toBe(false);
    });

    it("should set an error when the recipe fails to load", async () => {
        jest.mocked(getRecipeById).mockRejectedValue(new Error("boom"));

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        expect(result.current.recipe).toBeNull();
        expect(result.current.error).toBe("Error fetching recipe details");
    });

    it("should delete the recipe and navigate to the main page", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(RECIPE);
        jest.mocked(deleteRecipe).mockResolvedValue(undefined);

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        await act(async () => {
            await result.current.deleteRecipe();
        });

        expect(jest.mocked(deleteRecipe)).toHaveBeenCalledWith("1");
        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });

    it("should set an error when deleting the recipe fails", async () => {
        jest.mocked(getRecipeById).mockResolvedValue(RECIPE);
        jest.mocked(deleteRecipe).mockRejectedValue(new Error("boom"));

        const { result } = renderHook(() => useRecipeDetails("1"));

        await flush();

        await act(async () => {
            await result.current.deleteRecipe();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(result.current.error).toBe("Error deleting recipe");
    });

    it("should not fetch or delete the recipe when no id is provided", async () => {
        const { result } = renderHook(() => useRecipeDetails(undefined));

        await flush();

        await act(async () => {
            await result.current.deleteRecipe();
        });

        expect(jest.mocked(getRecipeById)).not.toHaveBeenCalled();
        expect(jest.mocked(deleteRecipe)).not.toHaveBeenCalled();
        expect(result.current.recipe).toBeNull();
    });
});
