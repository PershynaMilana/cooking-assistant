import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import { getIngredients } from "api/ingredientsApi";
import { createRecipe } from "api/recipesApi";
import { getRecipeTypes } from "api/recipeTypesApi";

import { useCreateRecipeForm } from "hooks/useCreateRecipeForm";

import { flushMicrotasks as flush } from "test/flush";
import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/recipesApi");
jest.mock("api/ingredientsApi");
jest.mock("api/recipeTypesApi");

const fillValid = (form: ReturnType<typeof useCreateRecipeForm>["form"]) => {
    form.setInitialValues({
        title: "Soup",
        content: "boil",
        cookingTime: "0:30",
        servings: "2",
        selectedTypeId: 3,
        selectedIngredients: [
            { id: 1, name: "Egg", quantity: 1, unit_name: "pcs" },
        ],
    });
};

describe("useCreateRecipeForm", () => {
    beforeEach(() => {
        jest.mocked(getIngredients).mockResolvedValue([]);
        jest.mocked(getRecipeTypes).mockResolvedValue([]);
    });

    it("should load the ingredient and type options", async () => {
        jest.mocked(getIngredients).mockResolvedValue([
            { id: 1, name: "Egg", unit_name: "pcs" },
        ]);
        jest.mocked(getRecipeTypes).mockResolvedValue([
            { id: 3, type_name: "Soup", description: "" },
        ]);

        const { result } = renderHook(() => useCreateRecipeForm());

        await flush();

        expect(result.current.allIngredients).toHaveLength(1);
        expect(result.current.allTypes).toHaveLength(1);
    });

    it("should not create the recipe when the form is invalid", async () => {
        const { result } = renderHook(() => useCreateRecipeForm());

        await flush();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(createRecipe)).not.toHaveBeenCalled();
    });

    it("should create the recipe and navigate home when valid", async () => {
        jest.mocked(createRecipe).mockResolvedValue(undefined);

        const { result } = renderHook(() => useCreateRecipeForm());

        await flush();

        act(() => {
            fillValid(result.current.form);
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(createRecipe)).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Soup",
                type_id: 3,
            }),
        );
        expect(mockNavigate).toHaveBeenCalledWith("/main");
    });

    it("should set the form error when creation fails", async () => {
        jest.mocked(createRecipe).mockRejectedValue(new Error("Network error"));

        const { result } = renderHook(() => useCreateRecipeForm());

        await flush();

        act(() => {
            fillValid(result.current.form);
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.form.error).toBe("Network error");
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
