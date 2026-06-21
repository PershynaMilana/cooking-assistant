import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import type { MenuDetails } from "types/menu";

import { getMenuCategories } from "api/menuCategoriesApi";
import { getMenuById, updateMenu } from "api/menusApi";
import { getRecipes } from "api/recipesApi";

import { useEditMenuForm } from "hooks/useEditMenuForm";

import { flushMicrotasks as flush } from "test/flush";
import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/menuCategoriesApi");
jest.mock("api/menusApi");
jest.mock("api/recipesApi");

const MENU_TITLE = "Weekday menu";

const MENU: MenuDetails = {
    menu: {
        id: 1,
        title: MENU_TITLE,
        categoryname: "Lunch",
        menucontent: "quick meals",
        category_id: 2,
        personid: 7,
        isOwner: true,
    },
    recipes: [
        {
            recipe_id: 5,
            title: "Borscht",
            type_name: "Soup",
            cooking_time: 60,
            creation_date: "2024-01-01",
        },
    ],
};

describe("useEditMenuForm", () => {
    beforeEach(() => {
        jest.mocked(getMenuCategories).mockResolvedValue([]);
        jest.mocked(getRecipes).mockResolvedValue([]);
        jest.mocked(getMenuById).mockResolvedValue(MENU);
    });

    it("should load the menu into the form and finish loading", async () => {
        const { result } = renderHook(() => useEditMenuForm("1"));

        await flush();

        expect(result.current.form.menuTitle).toBe(MENU_TITLE);
        expect(result.current.form.selectedCategory).toBe(2);
        expect(result.current.form.selectedRecipes).toEqual([5]);
        expect(result.current.loading).toBe(false);
    });

    it("should default empty title and description to empty strings", async () => {
        jest.mocked(getMenuById).mockResolvedValue({
            ...MENU,
            menu: { ...MENU.menu, title: "", menucontent: "" },
        });

        const { result } = renderHook(() => useEditMenuForm("1"));

        await flush();

        expect(result.current.form.menuTitle).toBe("");
        expect(result.current.form.menuDescription).toBe("");
    });

    it("should update the menu and navigate to the menu list on submit", async () => {
        jest.mocked(updateMenu).mockResolvedValue(undefined);

        const { result } = renderHook(() => useEditMenuForm("1"));

        await flush();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(updateMenu)).toHaveBeenCalledWith("1", {
            menuTitle: MENU_TITLE,
            menuContent: "quick meals",
            categoryId: 2,
            recipeIds: [5],
        });
        expect(mockNavigate).toHaveBeenCalledWith("/menu");
    });

    it("should not update the menu when submitting without an id", async () => {
        const { result } = renderHook(() => useEditMenuForm(undefined));

        await flush();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(updateMenu)).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should set loading to false immediately when there is no id", async () => {
        const { result } = renderHook(() => useEditMenuForm(undefined));

        await flush();

        expect(result.current.loading).toBe(false);
        expect(jest.mocked(getMenuById)).not.toHaveBeenCalled();
    });

    it("should set error when fetching the menu fails", async () => {
        jest.mocked(getMenuById).mockRejectedValue(new Error("network"));

        const { result } = renderHook(() => useEditMenuForm("1"));

        await flush();

        expect(result.current.error).toBe(
            "Failed to load categories or recipes.",
        );
        expect(result.current.loading).toBe(false);
    });

    it("should set error when submitting the menu update fails", async () => {
        jest.mocked(updateMenu).mockRejectedValue(new Error("network"));

        const { result } = renderHook(() => useEditMenuForm("1"));

        await flush();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.error).toBe(
            "Failed to update menu. Please try again later.",
        );
    });

    it("should clear load error before a second fetch", async () => {
        jest.mocked(getMenuById)
            .mockRejectedValueOnce(new Error("Network error"))
            .mockResolvedValue(MENU);

        const { result, rerender } = renderHook(
            ({ id }: { id: string }) => useEditMenuForm(id),
            { initialProps: { id: "1" } },
        );

        await flush();

        expect(result.current.error).not.toBeNull();

        rerender({ id: "2" });

        await flush();

        expect(result.current.error).toBeNull();
        expect(result.current.form.menuTitle).toBe(MENU_TITLE);
    });
});
