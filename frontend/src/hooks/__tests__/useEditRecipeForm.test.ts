import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import type { RecipeDetails } from "types/recipe";

import { getIngredients } from "api/ingredientsApi";
import { getRecipeById, updateRecipe } from "api/recipesApi";
import { getRecipeTypes } from "api/recipeTypesApi";

import { useEditRecipeForm } from "hooks/useEditRecipeForm";

import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/recipesApi");
jest.mock("api/ingredientsApi");
jest.mock("api/recipeTypesApi");

const RECIPE: RecipeDetails = {
    id: 1,
    title: "Borscht",
    content: "beetroot soup",
    ingredients: [
        {
            id: 1,
            name: "Beet",
            quantity_recipe_ingredients: 2,
            unit_name: "pcs",
        },
    ],
    type_id: 2,
    type_name: "Soup",
    cooking_time: 90,
    creation_date: "2024-01-01",
    servings: "4",
    person_id: 3,
};

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

describe("useEditRecipeForm", () => {
    beforeEach(() => {
        jest.mocked(getIngredients).mockResolvedValue([]);
        jest.mocked(getRecipeTypes).mockResolvedValue([]);
        jest.mocked(getRecipeById).mockResolvedValue(RECIPE);
    });

    it("should load the recipe into the form", async () => {
        const { result } = renderHook(() => useEditRecipeForm("1"));

        await flush();

        expect(result.current.form.title).toBe("Borscht");
        expect(result.current.form.cookingTime).toBe("01:30");
        expect(result.current.form.selectedIngredients).toHaveLength(1);
    });

    it("should update the recipe and navigate home on submit", async () => {
        jest.mocked(updateRecipe).mockResolvedValue(undefined);

        const { result } = renderHook(() => useEditRecipeForm("1"));

        await flush();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(updateRecipe)).toHaveBeenCalledWith(
            "1",
            expect.objectContaining({ title: "Borscht", cooking_time: 90 }),
        );
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("should not update when there is no id", async () => {
        const { result } = renderHook(() => useEditRecipeForm(undefined));

        await flush();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(updateRecipe)).not.toHaveBeenCalled();
    });

    it("should set error when fetching the recipe fails", async () => {
        jest.mocked(getRecipeById).mockRejectedValue(
            new Error("Network error"),
        );

        const { result } = renderHook(() => useEditRecipeForm("1"));

        await flush();

        expect(result.current.form.error).toBe("Network error");
    });

    it("should set isLoading to false after the recipe loads", async () => {
        const { result } = renderHook(() => useEditRecipeForm("1"));

        expect(result.current.isLoading).toBe(true);

        await flush();

        expect(result.current.isLoading).toBe(false);
        expect(result.current.form.title).toBe("Borscht");
    });
});
