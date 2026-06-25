import type { MenuCategory } from "types/menu";

import { API_ROUTES } from "api/endpoints";

import { menuCategoriesApi } from "redux/services/menuCategoriesApi";

import { mockedGet } from "test/apiClientMock";
import { makeTestStore } from "test/store";

jest.mock("api/client");

const SAMPLE: MenuCategory[] = [
    { menu_category_id: 1, category_name: "Breakfast" },
];

describe("menuCategoriesApi", () => {
    it("should fetch the menu categories", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE });
        const store = makeTestStore();

        const result = await store.dispatch(
            menuCategoriesApi.endpoints.getMenuCategories.initiate(null),
        );

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.menuCategories.list, {
            params: undefined,
        });
        expect(result.data).toEqual(SAMPLE);
    });
});
