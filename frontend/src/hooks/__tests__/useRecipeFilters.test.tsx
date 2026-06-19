import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { useRecipeFilters } from "hooks/useRecipeFilters";

const makeWrapper =
    (url = "/test") =>
    ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    );

describe("useRecipeFilters", () => {
    it("should initialise with default filter state", () => {
        const { result } = renderHook(() => useRecipeFilters(), {
            wrapper: makeWrapper(),
        });

        expect(result.current.filters.selectedTypes).toEqual([]);
        expect(result.current.filters.sortOrder).toBe("asc");
        expect(result.current.filters.ingredientName).toBeNull();
    });

    it("should read ingredient_name from search params", () => {
        const { result } = renderHook(() => useRecipeFilters(), {
            wrapper: makeWrapper("/test?ingredient_name=tomato"),
        });

        expect(result.current.filters.ingredientName).toBe("tomato");
    });

    it("should build filter params with required fields always set", () => {
        const { result } = renderHook(() => useRecipeFilters(), {
            wrapper: makeWrapper(),
        });

        const params = result.current.buildFilterParams();

        expect(params.ingredient_name).toBe("");
        expect(params.sort_order).toBe("asc");
        expect(params.type_ids).toBeUndefined();
    });

    it("should include type_ids when types are selected", () => {
        const { result } = renderHook(() => useRecipeFilters(), {
            wrapper: makeWrapper(),
        });

        act(() => {
            result.current.setSelectedTypes([1, 2]);
        });

        const params = result.current.buildFilterParams();

        expect(params.type_ids).toBe("1,2");
    });

    it("should update sortOrder", () => {
        const { result } = renderHook(() => useRecipeFilters(), {
            wrapper: makeWrapper(),
        });

        act(() => {
            result.current.setSortOrder("desc");
        });

        expect(result.current.filters.sortOrder).toBe("desc");
        expect(result.current.buildFilterParams().sort_order).toBe("desc");
    });
});
