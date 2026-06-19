import { act, renderHook } from "@testing-library/react";

import { getMenuCategories } from "api/menuCategoriesApi";

import { useMenuCategories } from "hooks/useMenuCategories";

jest.mock("api/menuCategoriesApi");

const CATEGORIES = [
    { menu_category_id: 1, category_name: "Lunch" },
    { menu_category_id: 2, category_name: "Dinner" },
];

describe("useMenuCategories", () => {
    it("should load categories on mount", async () => {
        jest.mocked(getMenuCategories).mockResolvedValue(CATEGORIES);

        const { result } = renderHook(() => useMenuCategories());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.categories).toHaveLength(2);
        expect(result.current.categories[0].category_name).toBe("Lunch");
    });

    it("should return empty array when API fails", async () => {
        jest.mocked(getMenuCategories).mockRejectedValue(new Error("Network"));

        const { result } = renderHook(() => useMenuCategories());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.categories).toHaveLength(0);
    });
});
