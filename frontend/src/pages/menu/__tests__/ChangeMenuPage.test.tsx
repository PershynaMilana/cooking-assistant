import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { MenuDetails } from "types/menu";
import type { RecipeWithIngredientNames } from "types/recipe";

import { getMenuCategories } from "api/menuCategoriesApi";
import { getMenuById, updateMenu } from "api/menusApi";
import { getRecipes } from "api/recipesApi";

import ChangeMenuPage from "pages/menu/ChangeMenuPage";
import { ERROR_RECIPES_REQUIRED, ROUTE_MENU } from "test/constants";
import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/menusApi");
jest.mock("api/menuCategoriesApi");
jest.mock("api/recipesApi");

const TITLE = "Weekday menu";
const UPDATE_MENU = "Update Menu";
const CATEGORY_ID = 2;
const RECIPE: RecipeWithIngredientNames = {
    id: 10,
    title: "Borscht",
    type_name: "Soup",
    cooking_time: 60,
    creation_date: "2024-01-01",
    ingredients: [],
};
const MENU_RECIPE = {
    id: 10,
    recipe_id: 10,
    title: "Borscht",
    type_name: "Soup",
    cooking_time: 60,
    creation_date: "2024-01-01",
};
const CATEGORIES = [{ menu_category_id: CATEGORY_ID, category_name: "Lunch" }];

const SAMPLE: MenuDetails = {
    menu: {
        id: 1,
        title: TITLE,
        categoryname: "Lunch",
        menucontent: "quick",
        categoryid: CATEGORY_ID,
    },
    recipes: [],
};

const SAMPLE_WITH_RECIPE: MenuDetails = {
    ...SAMPLE,
    recipes: [MENU_RECIPE],
};

const setup = (sample: MenuDetails = SAMPLE) => {
    jest.mocked(getMenuById).mockResolvedValue(sample);
    jest.mocked(getMenuCategories).mockResolvedValue(CATEGORIES);
    jest.mocked(getRecipes).mockResolvedValue([RECIPE]);

    render(
        <MemoryRouter initialEntries={["/change-menu/1"]}>
            <Routes>
                <Route path="/change-menu/:id" element={<ChangeMenuPage />} />
            </Routes>
        </MemoryRouter>,
    );
};

describe("ChangeMenuPage", () => {
    it("should load the menu into the edit form", async () => {
        setup();

        expect(await screen.findByDisplayValue(TITLE)).toBeInTheDocument();
    });

    it("should call updateMenu with the changed values on valid submit", async () => {
        jest.mocked(updateMenu).mockResolvedValue(undefined);
        setup(SAMPLE_WITH_RECIPE);

        await screen.findByDisplayValue(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: UPDATE_MENU }),
        );

        expect(jest.mocked(updateMenu)).toHaveBeenCalledWith(
            "1",
            expect.objectContaining({
                menuTitle: TITLE,
                categoryId: CATEGORY_ID,
                recipeIds: [MENU_RECIPE.id],
            }),
        );
    });

    it("should navigate to /menu after successful update", async () => {
        jest.mocked(updateMenu).mockResolvedValue(undefined);
        setup(SAMPLE_WITH_RECIPE);

        await screen.findByDisplayValue(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: UPDATE_MENU }),
        );

        expect(mockNavigate).toHaveBeenCalledWith(ROUTE_MENU);
    });

    it("should display a validation error when no recipes are selected", async () => {
        setup();

        await screen.findByDisplayValue(TITLE);

        await userEvent.click(
            screen.getByRole("button", { name: UPDATE_MENU }),
        );

        expect(screen.getByText(ERROR_RECIPES_REQUIRED)).toBeInTheDocument();
    });
});
