import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { useMenuFilters } from "hooks/useMenuFilters";

const makeWrapper =
    (url = "/test") =>
    ({ children }: { children: ReactNode }) => (
        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    );

describe("useMenuFilters", () => {
    it("should initialise with no categories selected", () => {
        const { result } = renderHook(() => useMenuFilters(), {
            wrapper: makeWrapper(),
        });

        expect(result.current.selectedCategories).toEqual([]);
        expect(result.current.menuName).toBeNull();
    });

    it("should read menu name from ingredient_name search param", () => {
        const { result } = renderHook(() => useMenuFilters(), {
            wrapper: makeWrapper("/test?ingredient_name=soup"),
        });

        expect(result.current.menuName).toBe("soup");
    });

    it("should pass menu name as-is to params", () => {
        const { result } = renderHook(() => useMenuFilters(), {
            wrapper: makeWrapper("/test?ingredient_name=my menu"),
        });

        const params = result.current.buildFilterParams();

        expect(params.menu_name).toBe("my menu");
    });

    it("should include category_ids when categories are selected", () => {
        const { result } = renderHook(() => useMenuFilters(), {
            wrapper: makeWrapper(),
        });

        act(() => {
            result.current.setSelectedCategories([1, 2]);
        });

        const params = result.current.buildFilterParams();

        expect(params.category_ids).toBe("1,2");
    });
});
