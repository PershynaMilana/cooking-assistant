import { act, renderHook } from "@testing-library/react";

import { getRecipeTypes } from "api/recipeTypesApi";

import { useRecipeTypes } from "hooks/useRecipeTypes";

jest.mock("api/recipeTypesApi");

const TYPES = [
    { id: 1, type_name: "Soup", description: "warm soup" },
    { id: 2, type_name: "Salad", description: "fresh salad" },
];

describe("useRecipeTypes", () => {
    it("should load recipe types on mount", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue(TYPES);

        const { result } = renderHook(() => useRecipeTypes());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.types).toHaveLength(2);
        expect(result.current.types[0].type_name).toBe("Soup");
    });

    it("should return empty array when API fails", async () => {
        jest.mocked(getRecipeTypes).mockRejectedValue(new Error("Network"));

        const { result } = renderHook(() => useRecipeTypes());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.types).toHaveLength(0);
    });
});
