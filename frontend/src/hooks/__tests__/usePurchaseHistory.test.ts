import { act, renderHook } from "@testing-library/react";

import type { Purchase } from "types/userIngredient";

import { getPurchaseHistory, updatePurchase } from "api/userIngredientsApi";

import { usePurchaseHistory } from "hooks/usePurchaseHistory";

import { mockJwtUser, setAuthToken } from "test/auth";
import { MOCK_ERROR_SERVER } from "test/constants";

jest.mock("api/userIngredientsApi");
jest.mock("jwt-decode");

const USER_ID = 7;
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
    it("should set error and not fetch when no auth token", async () => {
        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.error).toBe("Token not found.");
        expect(jest.mocked(getPurchaseHistory)).not.toHaveBeenCalled();
    });

    it("should set loading true during fetch then false after", async () => {
        setAuthToken();
        mockJwtUser(USER_ID);

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
        setAuthToken();
        mockJwtUser(USER_ID);
        jest.mocked(getPurchaseHistory).mockResolvedValue(HISTORY);

        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        await act(async () => {
            await Promise.resolve();
        });

        expect(jest.mocked(getPurchaseHistory)).toHaveBeenCalledWith(
            USER_ID,
            INGREDIENT_ID,
        );
        expect(result.current.purchaseHistory).toHaveLength(2);
    });

    it("should call updatePurchase with new quantity on saveChange", async () => {
        setAuthToken();
        mockJwtUser(USER_ID);
        jest.mocked(getPurchaseHistory).mockResolvedValue(HISTORY);
        jest.mocked(updatePurchase).mockResolvedValue(undefined);

        const { result } = renderHook(() => usePurchaseHistory(INGREDIENT_ID));

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            await result.current.saveChange(1, 10);
        });

        expect(jest.mocked(updatePurchase)).toHaveBeenCalledWith(USER_ID, 1, {
            quantity: 10,
        });
    });

    it("should set error when saveChange API fails", async () => {
        setAuthToken();
        mockJwtUser(USER_ID);
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
