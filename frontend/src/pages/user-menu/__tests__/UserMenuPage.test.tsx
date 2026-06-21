import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { Menu, MenuCategory } from "types/menu";

import { getMenuCategories } from "api/menuCategoriesApi";
import { getMenusByPerson } from "api/menusApi";

import UserMenuPage from "pages/user-menu/UserMenuPage";
import { renderWithRouter } from "test/router";

jest.mock("api/menusApi");
jest.mock("api/menuCategoriesApi");

const TITLE = "Weekday menu";
const CATEGORY_NAME = "Lunch";
const SAMPLE: Menu[] = [
    { id: 1, title: TITLE, categoryname: CATEGORY_NAME, menucontent: "quick" },
];
const CATEGORIES: MenuCategory[] = [
    { menu_category_id: 3, category_name: CATEGORY_NAME },
];

describe("UserMenuPage", () => {
    it("should render the user's menus loaded from the api", async () => {
        jest.mocked(getMenusByPerson).mockResolvedValue(SAMPLE);
        jest.mocked(getMenuCategories).mockResolvedValue([]);

        renderWithRouter(<UserMenuPage />, ["/my-menus"]);

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });

    it("should show the by-categories heading when a category is selected", async () => {
        jest.mocked(getMenusByPerson).mockResolvedValue(SAMPLE);
        jest.mocked(getMenuCategories).mockResolvedValue(CATEGORIES);

        renderWithRouter(<UserMenuPage />, ["/my-menus"]);

        await userEvent.click(screen.getByRole("button", { name: "Filter" }));
        await userEvent.click(screen.getByRole("checkbox"));

        expect(
            await screen.findByText(`Menus by categories: ${CATEGORY_NAME}`),
        ).toBeInTheDocument();
    });
});
