import { act, renderHook } from "@testing-library/react";

import { getIngredients } from "api/ingredientsApi";
import { getRecipeTypes } from "api/recipeTypesApi";

import { useRecipeFormData } from "hooks/useRecipeFormData";

import { MOCK_ERROR_INGREDIENTS, MOCK_ERROR_TYPES } from "test/constants";

jest.mock("api/ingredientsApi");
jest.mock("api/recipeTypesApi");

const TYPES = [
    { id: 1, type_name: "Soup", description: "" },
    { id: 2, type_name: "Salad", description: "" },
];

const UNSORTED_INGREDIENTS = [
    { id: 1, name: "Zucchini", unit_name: "kg" },
    { id: 2, name: "Apple", unit_name: "g" },
    { id: 3, name: "Beet", unit_name: "g" },
];

describe("useRecipeFormData", () => {
    it("should load ingredients and types on mount", async () => {
        jest.mocked(getIngredients).mockResolvedValue(UNSORTED_INGREDIENTS);
        jest.mocked(getRecipeTypes).mockResolvedValue(TYPES);

        const { result } = renderHook(() => useRecipeFormData());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.allIngredients).toHaveLength(3);
        expect(result.current.allTypes).toHaveLength(2);
        expect(result.current.fetchError).toBeNull();
    });

    it("should sort ingredients alphabetically by name", async () => {
        jest.mocked(getIngredients).mockResolvedValue(UNSORTED_INGREDIENTS);
        jest.mocked(getRecipeTypes).mockResolvedValue(TYPES);

        const { result } = renderHook(() => useRecipeFormData());

        await act(async () => {
            await Promise.resolve();
        });

        const names = result.current.allIngredients.map((i) => i.name);

        expect(names[0]).toBe("Apple");
        expect(names[1]).toBe("Beet");
        expect(names[2]).toBe("Zucchini");
    });

    it("should set fetchError when ingredient API fails", async () => {
        jest.mocked(getIngredients).mockRejectedValue(
            new Error(MOCK_ERROR_INGREDIENTS),
        );
        jest.mocked(getRecipeTypes).mockResolvedValue(TYPES);

        const { result } = renderHook(() => useRecipeFormData());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.fetchError).toBe(MOCK_ERROR_INGREDIENTS);
    });

    it("should set fetchError when types API fails", async () => {
        jest.mocked(getIngredients).mockResolvedValue([]);
        jest.mocked(getRecipeTypes).mockRejectedValue(
            new Error(MOCK_ERROR_TYPES),
        );

        const { result } = renderHook(() => useRecipeFormData());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.fetchError).toBe(MOCK_ERROR_TYPES);
    });
});
