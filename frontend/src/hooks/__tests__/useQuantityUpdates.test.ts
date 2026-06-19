import { act, renderHook } from "@testing-library/react";

import type { PantryIngredient } from "types/userIngredient";

import { updateQuantities } from "api/userIngredientsApi";

import { useQuantityUpdates } from "hooks/useQuantityUpdates";

import { mockJwtUser, setAuthToken } from "test/auth";

jest.mock("api/userIngredientsApi");
jest.mock("jwt-decode");

const INGREDIENT: PantryIngredient = {
    id: 10,
    ingredient_name: "Potato",
    unit_name: "kg",
    quantity_person_ingradient: 3,
};

describe("useQuantityUpdates", () => {
    it("should start with isEditingQuantity false", () => {
        const { result } = renderHook(() => useQuantityUpdates([], jest.fn()));

        expect(result.current.isEditingQuantity).toBe(false);
    });

    it("should copy personIngredients into updatedIngredients on startEditing", () => {
        const { result } = renderHook(() =>
            useQuantityUpdates([INGREDIENT], jest.fn()),
        );

        act(() => {
            result.current.startEditing();
        });

        expect(result.current.isEditingQuantity).toBe(true);
        expect(result.current.updatedIngredients).toHaveLength(1);
        expect(result.current.updatedIngredients[0].id).toBe(INGREDIENT.id);
    });

    it("should update quantity when new value is higher than current", () => {
        const { result } = renderHook(() =>
            useQuantityUpdates([INGREDIENT], jest.fn()),
        );

        act(() => {
            result.current.startEditing();
        });

        act(() => {
            result.current.handleQuantityChange(INGREDIENT.id, 10);
        });

        expect(
            result.current.updatedIngredients.find(
                (i) => i.id === INGREDIENT.id,
            )?.quantity_person_ingradient,
        ).toBe(10);
    });

    it("should allow decreasing quantity to a lower value", () => {
        const { result } = renderHook(() =>
            useQuantityUpdates([INGREDIENT], jest.fn()),
        );

        act(() => {
            result.current.startEditing();
        });

        act(() => {
            result.current.handleQuantityChange(INGREDIENT.id, 1);
        });

        expect(
            result.current.updatedIngredients.find(
                (i) => i.id === INGREDIENT.id,
            )?.quantity_person_ingradient,
        ).toBe(1);
    });

    it("should not call API when quantities are unchanged on saveUpdatedQuantities", async () => {
        setAuthToken();
        mockJwtUser(5);

        const onSaved = jest.fn().mockResolvedValue(undefined);
        const { result } = renderHook(() =>
            useQuantityUpdates([INGREDIENT], onSaved),
        );

        act(() => {
            result.current.startEditing();
        });

        await act(async () => {
            await result.current.saveUpdatedQuantities();
        });

        expect(jest.mocked(updateQuantities)).not.toHaveBeenCalled();
    });

    it("should exit edit mode without API call when no changes made", async () => {
        setAuthToken();
        mockJwtUser(5);

        const { result } = renderHook(() =>
            useQuantityUpdates([INGREDIENT], jest.fn()),
        );

        act(() => {
            result.current.startEditing();
        });

        await act(async () => {
            await result.current.saveUpdatedQuantities();
        });

        expect(result.current.isEditingQuantity).toBe(false);
        expect(jest.mocked(updateQuantities)).not.toHaveBeenCalled();
    });

    it("should call updateQuantities only for changed ingredients", async () => {
        setAuthToken();
        mockJwtUser(5);
        jest.mocked(updateQuantities).mockResolvedValue(undefined);

        const onSaved = jest.fn().mockResolvedValue(undefined);
        const { result } = renderHook(() =>
            useQuantityUpdates([INGREDIENT], onSaved),
        );

        act(() => {
            result.current.startEditing();
        });

        act(() => {
            result.current.handleQuantityChange(INGREDIENT.id, 99);
        });

        await act(async () => {
            await result.current.saveUpdatedQuantities();
        });

        expect(jest.mocked(updateQuantities)).toHaveBeenCalledWith(
            5,
            expect.objectContaining({
                updatedIngredients: [
                    expect.objectContaining({ id: INGREDIENT.id }),
                ],
            }),
        );
    });

    it("should call onSaved callback after successful save", async () => {
        setAuthToken();
        mockJwtUser(5);
        jest.mocked(updateQuantities).mockResolvedValue(undefined);

        const onSaved = jest.fn().mockResolvedValue(undefined);
        const { result } = renderHook(() =>
            useQuantityUpdates([INGREDIENT], onSaved),
        );

        act(() => {
            result.current.startEditing();
        });

        act(() => {
            result.current.handleQuantityChange(INGREDIENT.id, 50);
        });

        await act(async () => {
            await result.current.saveUpdatedQuantities();
        });

        expect(onSaved).toHaveBeenCalledTimes(1);
    });

    it("should exit edit mode after successful save", async () => {
        setAuthToken();
        mockJwtUser(5);
        jest.mocked(updateQuantities).mockResolvedValue(undefined);

        const onSaved = jest.fn().mockResolvedValue(undefined);
        const { result } = renderHook(() =>
            useQuantityUpdates([INGREDIENT], onSaved),
        );

        act(() => {
            result.current.startEditing();
        });

        act(() => {
            result.current.handleQuantityChange(INGREDIENT.id, 20);
        });

        await act(async () => {
            await result.current.saveUpdatedQuantities();
        });

        expect(result.current.isEditingQuantity).toBe(false);
    });
});
