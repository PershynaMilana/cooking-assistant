import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import type { MenuDetails } from "types/menu";

import { deleteMenu, getMenuById } from "api/menusApi";

import { useMenuDetails } from "hooks/useMenuDetails";

import { getUserIdSafe } from "utils/getCurrentUserId";

import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/menusApi");
jest.mock("utils/getCurrentUserId");

const OWNER_ID = 5;
const MENU: MenuDetails = {
    menu: {
        id: 1,
        title: "Weekday menu",
        categoryname: "Lunch",
        menucontent: "quick",
        personid: OWNER_ID,
    },
    recipes: [],
};

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

describe("useMenuDetails", () => {
    it("should load the menu and mark the owner", async () => {
        jest.mocked(getMenuById).mockResolvedValue(MENU);
        jest.mocked(getUserIdSafe).mockReturnValue(OWNER_ID);

        const { result } = renderHook(() => useMenuDetails("1"));

        await flush();

        expect(result.current.menu).toEqual(MENU);
        expect(result.current.isOwner).toBe(true);
    });

    it("should not mark a non-owner as owner", async () => {
        jest.mocked(getMenuById).mockResolvedValue(MENU);
        jest.mocked(getUserIdSafe).mockReturnValue(99);

        const { result } = renderHook(() => useMenuDetails("1"));

        await flush();

        expect(result.current.isOwner).toBe(false);
    });

    it("should delete the menu and navigate to the menu list", async () => {
        jest.mocked(getMenuById).mockResolvedValue(MENU);
        jest.mocked(getUserIdSafe).mockReturnValue(OWNER_ID);
        jest.mocked(deleteMenu).mockResolvedValue(undefined);

        const { result } = renderHook(() => useMenuDetails("1"));

        await flush();

        await act(async () => {
            await result.current.deleteMenu();
        });

        expect(jest.mocked(deleteMenu)).toHaveBeenCalledWith(1);
        expect(mockNavigate).toHaveBeenCalledWith("/menu");
    });
});
