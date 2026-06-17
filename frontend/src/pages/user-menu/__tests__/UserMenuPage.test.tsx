import { screen } from "@testing-library/react";
import UserMenuPage from "../UserMenuPage";
import { getMenusByPerson } from "../../../api/menusApi";
import { getMenuCategories } from "../../../api/menuCategoriesApi";
import { renderWithRouter } from "../../../test/router";
import { setAuthToken, mockJwtUser } from "../../../test/auth";
import type { Menu } from "../../../types/menu";

jest.mock("../../../api/menusApi");
jest.mock("../../../api/menuCategoriesApi");
jest.mock("jwt-decode");

const TITLE = "Weekday menu";
const SAMPLE: Menu[] = [
    { id: 1, title: TITLE, categoryname: "Lunch", menucontent: "quick" },
];

describe("UserMenuPage", () => {
    it("should render the user's menus loaded from the api", async () => {
        setAuthToken();
        mockJwtUser();
        jest.mocked(getMenusByPerson).mockResolvedValue(SAMPLE);
        jest.mocked(getMenuCategories).mockResolvedValue([]);

        renderWithRouter(<UserMenuPage />, ["/my-menus"]);

        expect(await screen.findByText(TITLE)).toBeInTheDocument();
    });
});
