import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import type { MenuDetails } from "types/menu";

import { deleteMenu, getMenuById } from "api/menusApi";

import { useMenuDetails } from "hooks/useMenuDetails";

import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/menusApi");

const MENU: MenuDetails = {
    menu: {
        id: 1,
        title: "Weekday menu",
        categoryname: "Lunch",
        menucontent: "quick",
        category_id: 2,
        personid: 5,
        isOwner: true,
    },
    recipes: [],
};

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

describe("useMenuDetails", () => {
    it("should load the menu and expose isOwner:true when the backend returns isOwner:true", async () => {
        jest.mocked(getMenuById).mockResolvedValue(MENU);

        const { result } = renderHook(() => useMenuDetails("1"));

        await flush();

        expect(result.current.menu).toEqual(MENU);
        expect(result.current.isOwner).toBe(true);
    });

    it("should not mark as owner when the menu fails to load", async () => {
        jest.mocked(getMenuById).mockRejectedValue(new Error("404"));

        const { result } = renderHook(() => useMenuDetails("1"));

        await flush();

        expect(result.current.menu).toBeNull();
        expect(result.current.isOwner).toBe(false);
    });

    it("should delete the menu and navigate to the menu list", async () => {
        jest.mocked(getMenuById).mockResolvedValue(MENU);
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
