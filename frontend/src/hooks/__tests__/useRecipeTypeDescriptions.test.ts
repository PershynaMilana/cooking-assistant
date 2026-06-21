import { act, renderHook } from "@testing-library/react";

import { getRecipeTypes } from "api/recipeTypesApi";

import { useRecipeTypeDescriptions } from "hooks/useRecipeTypeDescriptions";

jest.mock("api/recipeTypesApi");

const NO_TYPES: number[] = [];

const ALL_TYPES = [
    { id: 1, type_name: "Soup", description: "warm liquid" },
    { id: 2, type_name: "Salad", description: "fresh greens" },
    { id: 3, type_name: "Dessert", description: "sweet end" },
];

describe("useRecipeTypeDescriptions", () => {
    it("should not fetch when selectedTypes is empty", async () => {
        const { result } = renderHook(() =>
            useRecipeTypeDescriptions(NO_TYPES),
        );

        await act(async () => {
            await Promise.resolve();
        });

        expect(jest.mocked(getRecipeTypes)).not.toHaveBeenCalled();
        expect(result.current.descriptions).toHaveLength(0);
        expect(result.current.typesHeader).toBe("");
    });

    it("should fetch descriptions when selectedTypes changes", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue([ALL_TYPES[0]]);

        const { rerender } = renderHook(
            ({ ids }: { ids: number[] }) => useRecipeTypeDescriptions(ids),
            { initialProps: { ids: NO_TYPES } },
        );

        rerender({ ids: [1] });

        await act(async () => {
            await Promise.resolve();
        });

        expect(jest.mocked(getRecipeTypes)).toHaveBeenCalledWith({
            ids: "1",
        });
    });

    it("should filter returned descriptions to only the selected type ids", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue(ALL_TYPES);

        const { result } = renderHook(() => useRecipeTypeDescriptions([1, 3]));

        await act(async () => {
            await Promise.resolve();
        });

        const ids = result.current.descriptions.map((d) => d.id);

        expect(ids).toContain(1);
        expect(ids).toContain(3);
        expect(ids).not.toContain(2);
    });

    it("should build typesHeader as comma-separated type names", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue([
            ALL_TYPES[0],
            ALL_TYPES[2],
        ]);

        const { result } = renderHook(() => useRecipeTypeDescriptions([1, 3]));

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.typesHeader).toBe("Soup, Dessert");
    });

    it("should keep descriptions empty when fetching fails", async () => {
        jest.mocked(getRecipeTypes).mockRejectedValue(new Error("boom"));

        const { result } = renderHook(() => useRecipeTypeDescriptions([1]));

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.descriptions).toHaveLength(0);
        expect(result.current.typesHeader).toBe("");
    });

    it("should clear descriptions when selectedTypes becomes empty", async () => {
        jest.mocked(getRecipeTypes).mockResolvedValue([ALL_TYPES[0]]);

        const { result, rerender } = renderHook(
            ({ ids }: { ids: number[] }) => useRecipeTypeDescriptions(ids),
            { initialProps: { ids: [1] as number[] } },
        );

        await act(async () => {
            await Promise.resolve();
        });

        rerender({ ids: [] });

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.descriptions).toHaveLength(0);
        expect(result.current.typesHeader).toBe("");
    });
});
