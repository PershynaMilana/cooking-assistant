import type {
    CreateMenuRequest,
    Menu,
    MenuDetails,
    MenuListParams,
    UpdateMenuRequest,
} from "types/menu";

import { API_ROUTES } from "api/endpoints";
import {
    createMenu,
    deleteMenu,
    getMenuById,
    getMenus,
    getMenusByPerson,
    updateMenu,
} from "api/menusApi";

import {
    mockedDelete,
    mockedGet,
    mockedPost,
    mockedPut,
} from "test/apiClientMock";

jest.mock("../client");

const ID = 7;
const PARAMS: MenuListParams = { menu_name: "weekday" };
const SAMPLE_MENUS: Menu[] = [
    { id: 1, title: "Weekday", categoryname: "Lunch", menucontent: "quick" },
];
const SAMPLE_DETAILS: MenuDetails = {
    menu: {
        id: 1,
        title: "Weekday",
        categoryname: "Lunch",
        menucontent: "quick",
        category_id: 2,
        isOwner: true,
    },
    recipes: [],
};
const CREATE_BODY: CreateMenuRequest = {
    menuTitle: "Weekday",
    menuContent: "quick",
    categoryId: 2,
    recipeIds: [5],
};
const UPDATE_BODY: UpdateMenuRequest = {
    menuTitle: "Weekday",
    menuContent: "quick",
    categoryId: 2,
    recipeIds: [5],
};

describe("menusApi", () => {
    it("should get menus with the query params and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_MENUS });

        const result = await getMenus(PARAMS);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.menu.list, {
            params: PARAMS,
        });
        expect(result).toEqual(SAMPLE_MENUS);
    });

    it("should get a menu by id and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_DETAILS });

        const result = await getMenuById(ID);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.menu.byId(ID));
        expect(result).toEqual(SAMPLE_DETAILS);
    });

    it("should get menus by person with the query params and return the data", async () => {
        mockedGet.mockResolvedValue({ data: SAMPLE_MENUS });

        const result = await getMenusByPerson(PARAMS);

        expect(mockedGet).toHaveBeenCalledWith(API_ROUTES.menu.byPerson, {
            params: PARAMS,
        });
        expect(result).toEqual(SAMPLE_MENUS);
    });

    it("should post a new menu to the create endpoint", async () => {
        mockedPost.mockResolvedValue({ data: undefined });

        await createMenu(CREATE_BODY);

        expect(mockedPost).toHaveBeenCalledWith(
            API_ROUTES.menu.create,
            CREATE_BODY,
        );
    });

    it("should put an updated menu to the by-id endpoint", async () => {
        mockedPut.mockResolvedValue({ data: undefined });

        await updateMenu(ID, UPDATE_BODY);

        expect(mockedPut).toHaveBeenCalledWith(
            API_ROUTES.menu.byId(ID),
            UPDATE_BODY,
        );
    });

    it("should delete a menu by id", async () => {
        mockedDelete.mockResolvedValue({ data: undefined });

        await deleteMenu(ID);

        expect(mockedDelete).toHaveBeenCalledWith(API_ROUTES.menu.byId(ID));
    });
});
