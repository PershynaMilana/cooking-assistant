import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import { getMenuCategories } from "api/menuCategoriesApi";
import { createMenu } from "api/menusApi";
import { getRecipes } from "api/recipesApi";

import { useCreateMenuForm } from "hooks/useCreateMenuForm";

import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/menuCategoriesApi");
jest.mock("api/menusApi");
jest.mock("api/recipesApi");

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

const fillValid = (form: ReturnType<typeof useCreateMenuForm>["form"]) => {
    form.setInitialValues({
        menuTitle: "Weekday",
        menuDescription: "Quick meals",
        selectedCategory: 2,
        selectedRecipes: [5],
    });
};

describe("useCreateMenuForm", () => {
    beforeEach(() => {
        jest.mocked(getMenuCategories).mockResolvedValue([]);
        jest.mocked(getRecipes).mockResolvedValue([]);
    });

    it("should load categories and recipes", async () => {
        jest.mocked(getMenuCategories).mockResolvedValue([
            { menu_category_id: 2, category_name: "Lunch" },
        ]);
        jest.mocked(getRecipes).mockResolvedValue([
            {
                id: 5,
                title: "Borscht",
                type_name: "Soup",
                creation_date: "2024-01-01",
                cooking_time: 60,
                ingredients: [],
            },
        ]);

        const { result } = renderHook(() => useCreateMenuForm());

        await flush();

        expect(result.current.categories).toHaveLength(1);
        expect(result.current.allRecipes).toHaveLength(1);
    });

    it("should not create the menu when the form is invalid", async () => {
        const { result } = renderHook(() => useCreateMenuForm());

        await flush();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(createMenu)).not.toHaveBeenCalled();
    });

    it("should create the menu and navigate to the menu list when valid", async () => {
        jest.mocked(createMenu).mockResolvedValue(undefined);

        const { result } = renderHook(() => useCreateMenuForm());

        await flush();

        act(() => {
            fillValid(result.current.form);
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(createMenu)).toHaveBeenCalledWith({
            menuTitle: "Weekday",
            menuContent: "Quick meals",
            categoryId: 2,
            recipeIds: [5],
        });
        expect(mockNavigate).toHaveBeenCalledWith("/menu");
    });
});
