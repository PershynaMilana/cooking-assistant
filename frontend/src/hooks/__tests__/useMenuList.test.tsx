import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import type { Menu } from "types/menu";

import { getMenuCategories } from "api/menuCategoriesApi";

import { useMenuList } from "hooks/useMenuList";

import { flushMicrotasks as flush } from "test/flush";

jest.mock("api/menuCategoriesApi");

const MENUS: Menu[] = [
    { id: 1, title: "Weekday", categoryname: "Lunch", menucontent: "quick" },
];

const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
);

describe("useMenuList", () => {
    it("should load menus from the fetcher", async () => {
        jest.mocked(getMenuCategories).mockResolvedValue([]);
        const fetcher = jest.fn().mockResolvedValue(MENUS);

        const { result } = renderHook(() => useMenuList(fetcher), { wrapper });

        await flush();

        expect(result.current.menus).toHaveLength(1);
        expect(result.current.noMenus).toBe(false);
    });

    it("should flag noMenus when the fetcher returns an empty list", async () => {
        jest.mocked(getMenuCategories).mockResolvedValue([]);
        const fetcher = jest.fn().mockResolvedValue([]);

        const { result } = renderHook(() => useMenuList(fetcher), { wrapper });

        await flush();

        expect(result.current.noMenus).toBe(true);
    });

    it("should expose an error when the fetcher rejects", async () => {
        jest.mocked(getMenuCategories).mockResolvedValue([]);
        const fetcher = jest.fn().mockRejectedValue(new Error("network"));

        const { result } = renderHook(() => useMenuList(fetcher), { wrapper });

        await flush();

        expect(result.current.error).toBeTruthy();
    });
});
