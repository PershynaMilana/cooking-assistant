import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as ReactRouterDom from "react-router-dom";

import { getMenuCategories } from "api/menuCategoriesApi";
import { createMenu } from "api/menusApi";
import { getRecipes } from "api/recipesApi";

import CreateMenuPage from "pages/menu/CreateMenuPage";
import { mockJwtUser, setAuthToken } from "test/auth";
import { mockNavigate, renderWithRouter } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("../../../api/menuCategoriesApi");
jest.mock("../../../api/recipesApi");
jest.mock("../../../api/menusApi");
jest.mock("jwt-decode");

const PERSON_ID = 7;
const CATEGORY_ID = 2;
const CATEGORY_NAME = "Lunch";
const RECIPE_ID = 5;
const RECIPE_TITLE = "Borscht";
const MENU_TITLE = "Weekday menu";
const MENU_DESC = "Quick lunches";

const SAMPLE_CATEGORIES = [
    { menu_category_id: CATEGORY_ID, category_name: CATEGORY_NAME },
];
const SAMPLE_RECIPES = [
    {
        id: RECIPE_ID,
        title: RECIPE_TITLE,
        type_name: "Soup",
        creation_date: "2024-01-01",
        cooking_time: 60,
        ingredients: [],
    },
];

describe("CreateMenuPage", () => {
    it("should create the menu and navigate to the menu list on submit", async () => {
        setAuthToken();
        mockJwtUser(PERSON_ID);
        jest.mocked(getMenuCategories).mockResolvedValue(SAMPLE_CATEGORIES);
        jest.mocked(getRecipes).mockResolvedValue(SAMPLE_RECIPES);
        const mockedCreateMenu = jest.mocked(createMenu);

        mockedCreateMenu.mockResolvedValue(undefined);

        renderWithRouter(<CreateMenuPage />);

        const recipeButton = await screen.findByRole("button", {
            name: RECIPE_TITLE,
        });

        await userEvent.type(screen.getByLabelText("Menu title"), MENU_TITLE);
        await userEvent.type(
            screen.getByLabelText("Menu description"),
            MENU_DESC,
        );
        await userEvent.selectOptions(
            screen.getByLabelText("Menu category"),
            String(CATEGORY_ID),
        );
        await userEvent.click(recipeButton);
        await userEvent.click(
            screen.getByRole("button", { name: "Create Menu" }),
        );

        expect(mockedCreateMenu).toHaveBeenCalledWith({
            menuTitle: MENU_TITLE,
            menuContent: MENU_DESC,
            categoryId: CATEGORY_ID,
            personId: PERSON_ID,
            recipeIds: [RECIPE_ID],
        });
        expect(mockNavigate).toHaveBeenCalledWith("/menu");
    });
});
