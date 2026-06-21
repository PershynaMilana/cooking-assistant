import { act, renderHook } from "@testing-library/react";

import type { Purchase } from "types/userIngredient";

import { getPurchaseHistory, updatePurchase } from "api/userIngredientsApi";

import { usePurchaseHistory } from "hooks/usePurchaseHistory";

import { MOCK_ERROR_SERVER } from "test/constants";

jest.mock("api/userIngredientsApi");

const INGREDIENT_ID = 3;

const HISTORY: Purchase[] = [
    {
        id: 1,
        quantity: 2,
        purchase_date: "2024-01-01",
        unit_name: "kg",
        days_to_expire: 7,
    },
    {
        id: 2,
        quantity: 5,
        purchase_date: "2024-02-01",
        unit_name: "kg",
        days_to_expire: 7,
    },
];

describe("usePurchaseHistory", () => {
    it("should set loading true during fetch then false after", async () => {
        let resolveHistory!: (v: Purchase[]) => void;
        const historyPromise = new Promise<Purchase[]>((res) => {
            resolveHistory = res;
        });

        jest.mocked(getPurchaseHistory).mockReturnValue(historyPromise);

        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        expect(result.current.loading).toBe(true);

        await act(async () => {
            resolveHistory(HISTORY);
            await historyPromise;
        });

        expect(result.current.loading).toBe(false);
    });

    it("should load purchase history for the given ingredientId", async () => {
        jest.mocked(getPurchaseHistory).mockResolvedValue(HISTORY);

        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        await act(async () => {
            await Promise.resolve();
        });

        expect(jest.mocked(getPurchaseHistory)).toHaveBeenCalledWith(
            INGREDIENT_ID,
        );
        expect(result.current.purchaseHistory).toHaveLength(2);
    });

    it("should call updatePurchase with new quantity on saveChange", async () => {
        jest.mocked(getPurchaseHistory).mockResolvedValue(HISTORY);
        jest.mocked(updatePurchase).mockResolvedValue(undefined);

        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            await result.current.saveChange(1, 10);
        });

        expect(jest.mocked(updatePurchase)).toHaveBeenCalledWith(1, {
            quantity: 10,
        });
    });

    it("should set error when fetching history fails", async () => {
        jest.mocked(getPurchaseHistory).mockRejectedValue(
            new Error(MOCK_ERROR_SERVER),
        );

        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.error).toBe(MOCK_ERROR_SERVER);
    });

    it("should update the quantity locally on handleQuantityChange", async () => {
        jest.mocked(getPurchaseHistory).mockResolvedValue(HISTORY);

        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        await act(async () => {
            await Promise.resolve();
        });

        act(() => {
            result.current.handleQuantityChange(1, 99);
        });

        expect(result.current.purchaseHistory).toEqual([
            { ...HISTORY[0], quantity: 99 },
            HISTORY[1],
        ]);
    });

    it("should set error when saveChange API fails", async () => {
        jest.mocked(getPurchaseHistory).mockResolvedValue(HISTORY);
        jest.mocked(updatePurchase).mockRejectedValue(
            new Error(MOCK_ERROR_SERVER),
        );

        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            await result.current.saveChange(1, 10);
        });

        expect(result.current.error).toBe(MOCK_ERROR_SERVER);
    });
});
