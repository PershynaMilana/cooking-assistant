import { act, renderHook } from "@testing-library/react";

import type { Menu } from "types/menu";
import type { RecipesStatsResponse } from "types/stats";

import { getMenus } from "api/menusApi";
import { getRecipes } from "api/recipesApi";
import { getRecipesStats } from "api/statsApi";

import { useMenuStatistics } from "hooks/useMenuStatistics";

import { mockJwtUser, setAuthToken } from "test/auth";
import { MOCK_ERROR_NETWORK } from "test/constants";

jest.mock("api/menusApi");
jest.mock("api/recipesApi");
jest.mock("api/statsApi");
jest.mock("jwt-decode");

const MENU = (category: string): Menu => ({
    id: 1,
    title: "Weekly",
    menucontent: "desc",
    categoryname: category,
});

const EMPTY_STATS: RecipesStatsResponse = { averageCookingTimes: [] };

describe("useMenuStatistics", () => {
    beforeEach(() => {
        mockJwtUser(1);
    });

    it("should set error and not fetch when no auth token in localStorage", async () => {
        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.error).toBe("No auth token found.");
        expect(jest.mocked(getMenus)).not.toHaveBeenCalled();
    });

    it("should count total menus", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([
            MENU("Lunch"),
            MENU("Dinner"),
            MENU("Lunch"),
        ]);
        jest.mocked(getRecipes).mockResolvedValue([]);
        jest.mocked(getRecipesStats).mockResolvedValue(EMPTY_STATS);

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.menusCount).toBe(3);
    });

    it("should count total recipes", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([]);
        jest.mocked(getRecipes).mockResolvedValue([
            {
                id: 1,
                title: "A",
                type_name: "X",
                creation_date: "",
                cooking_time: 10,
                ingredients: [],
            },
            {
                id: 2,
                title: "B",
                type_name: "Y",
                creation_date: "",
                cooking_time: 20,
                ingredients: [],
            },
        ]);
        jest.mocked(getRecipesStats).mockResolvedValue(EMPTY_STATS);

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.recipesCount).toBe(2);
    });

    it("should aggregate menu count by category", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([
            MENU("Lunch"),
            MENU("Lunch"),
            MENU("Dinner"),
        ]);
        jest.mocked(getRecipes).mockResolvedValue([]);
        jest.mocked(getRecipesStats).mockResolvedValue(EMPTY_STATS);

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        const lunch = result.current.menuCountByCategory.find(
            (c) => c.categoryname === "Lunch",
        );
        const dinner = result.current.menuCountByCategory.find(
            (c) => c.categoryname === "Dinner",
        );

        expect(lunch?.menuCount).toBe(2);
        expect(dinner?.menuCount).toBe(1);
    });

    it("should format average cooking time as HH:MM from float minutes", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([]);
        jest.mocked(getRecipes).mockResolvedValue([]);
        jest.mocked(getRecipesStats).mockResolvedValue({
            averageCookingTimes: [
                { typeName: "Soup", averageCookingTime: "90" },
            ],
        });

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.averageCookingTimes[0].averageCookingTime).toBe(
            "01:30",
        );
    });

    it("should pad single-digit hours and minutes with leading zero", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([]);
        jest.mocked(getRecipes).mockResolvedValue([]);
        jest.mocked(getRecipesStats).mockResolvedValue({
            averageCookingTimes: [
                { typeName: "Salad", averageCookingTime: "5" },
            ],
        });

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.averageCookingTimes[0].averageCookingTime).toBe(
            "00:05",
        );
    });

    it("should set averageCookingTimes to empty array when stats response is not an array", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([]);
        jest.mocked(getRecipes).mockResolvedValue([]);
        jest.mocked(getRecipesStats).mockResolvedValue({
            averageCookingTimes: null,
        });

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.averageCookingTimes).toEqual([]);
    });

    it("should set error message on API failure", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockRejectedValue(new Error(MOCK_ERROR_NETWORK));

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.error).toBe(MOCK_ERROR_NETWORK);
    });

    it("should use the provided recipesCount and not fetch recipes", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([]);
        jest.mocked(getRecipesStats).mockResolvedValue(EMPTY_STATS);

        const { result } = renderHook(() => useMenuStatistics(5));

        await act(async () => {
            await Promise.resolve();
        });

        expect(jest.mocked(getRecipes)).not.toHaveBeenCalled();
        expect(result.current.recipesCount).toBe(5);
    });

    it("should treat a non-numeric average cooking time as 0 minutes", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([]);
        jest.mocked(getRecipes).mockResolvedValue([]);
        jest.mocked(getRecipesStats).mockResolvedValue({
            averageCookingTimes: [
                { typeName: "Unknown", averageCookingTime: "N/A" },
            ],
        });

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.averageCookingTimes[0].averageCookingTime).toBe(
            "00:00",
        );
    });

    it("should round a decimal average cooking time to the nearest minute", async () => {
        setAuthToken();
        jest.mocked(getMenus).mockResolvedValue([]);
        jest.mocked(getRecipes).mockResolvedValue([]);
        jest.mocked(getRecipesStats).mockResolvedValue({
            averageCookingTimes: [
                { typeName: "Soup", averageCookingTime: "90.5" },
            ],
        });

        const { result } = renderHook(() => useMenuStatistics());

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.averageCookingTimes[0].averageCookingTime).toBe(
            "01:31",
        );
    });
});
