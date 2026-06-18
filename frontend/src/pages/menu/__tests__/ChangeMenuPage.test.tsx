import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { MenuDetails } from "types/menu";

import { getMenuCategories } from "api/menuCategoriesApi";
import { getMenuById } from "api/menusApi";
import { getRecipes } from "api/recipesApi";

import ChangeMenuPage from "pages/menu/ChangeMenuPage";

jest.mock("../../../api/menusApi");
jest.mock("../../../api/menuCategoriesApi");
jest.mock("../../../api/recipesApi");

const TITLE = "Weekday menu";
const CATEGORY_ID = 2;
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

describe("ChangeMenuPage", () => {
    it("should load the menu into the edit form", async () => {
        jest.mocked(getMenuById).mockResolvedValue(SAMPLE);
        jest.mocked(getMenuCategories).mockResolvedValue([
            { menu_category_id: CATEGORY_ID, category_name: "Lunch" },
        ]);
        jest.mocked(getRecipes).mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={["/change-menu/1"]}>
                <Routes>
                    <Route
                        path="/change-menu/:id"
                        element={<ChangeMenuPage />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        expect(await screen.findByDisplayValue(TITLE)).toBeInTheDocument();
    });
});
