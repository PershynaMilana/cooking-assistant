import { screen } from "@testing-library/react";

import type { Menu } from "types/menu";

import { getMenuCategories } from "api/menuCategoriesApi";
import { getMenus } from "api/menusApi";

import MenuPage from "pages/menu/MenuPage";
import { renderWithRouter } from "test/router";

jest.mock("api/menusApi");
jest.mock("api/menuCategoriesApi");

const TITLE = "Weekday menu";
const SAMPLE: Menu[] = [
    { id: 1, title: TITLE, categoryname: "Lunch", menucontent: "quick" },
];

describe("MenuPage", () => {
    it("should render the menus loaded from the api", async () => {
        jest.mocked(getMenus).mockResolvedValue(SAMPLE);
        jest.mocked(getMenuCategories).mockResolvedValue([]);

        renderWithRouter(<MenuPage />, ["/menu"]);

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });
});
