import { screen } from "@testing-library/react";

import type { Menu } from "types/menu";

import { getMenuCategories } from "api/menuCategoriesApi";
import { getMenusByPerson } from "api/menusApi";

import UserMenuPage from "pages/user-menu/UserMenuPage";
import { renderWithRouter } from "test/router";

jest.mock("api/menusApi");
jest.mock("api/menuCategoriesApi");

const TITLE = "Weekday menu";
const SAMPLE: Menu[] = [
    { id: 1, title: TITLE, categoryname: "Lunch", menucontent: "quick" },
];

describe("UserMenuPage", () => {
    it("should render the user's menus loaded from the api", async () => {
        jest.mocked(getMenusByPerson).mockResolvedValue(SAMPLE);
        jest.mocked(getMenuCategories).mockResolvedValue([]);

        renderWithRouter(<UserMenuPage />, ["/my-menus"]);

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });
});
