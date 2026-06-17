import { API_ROUTES } from "../endpoints";
import { getMenuCategories } from "../menuCategoriesApi";
import type { MenuCategory } from "../../types/menu";
import { mockedGet } from "../../test/apiClientMock";

jest.mock("../client");

const SAMPLE_CATEGORIES: MenuCategory[] = [
    { menu_category_id: 1, category_name: "Lunch" },
];

describe("menuCategoriesApi", () => {
    it("should get the menu categories and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_CATEGORIES });

        const result = await getMenuCategories();

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.menuCategories.list);
        expect(result).toEqual(SAMPLE_CATEGORIES);
    });
});
