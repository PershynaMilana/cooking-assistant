import { act, renderHook } from "@testing-library/react";

import type { PantryIngredient } from "types/userIngredient";

import { getIngredients } from "api/ingredientsApi";
import {
    deleteUserIngredient,
    getUserIngredients,
    saveUserIngredient,
    updateQuantities,
} from "api/userIngredientsApi";

import { useIngredientCatalog } from "hooks/useIngredientCatalog";

import { MOCK_ERROR_NETWORK } from "test/constants";
import { flushMicrotasks as flushEffects } from "test/flush";

jest.mock("api/ingredientsApi");
jest.mock("api/userIngredientsApi");

const setup = () => {
    jest.mocked(getIngredients).mockResolvedValue([]);
    jest.mocked(getUserIngredients).mockResolvedValue([]);
    jest.mocked(updateQuantities).mockResolvedValue(undefined);
};

describe("useIngredientCatalog", () => {
    describe("handleSaveOrToggleEdit", () => {
        it("should set isEditing to true when not currently editing", async () => {
            setup();

            const { result } = renderHook(() => useIngredientCatalog());

            await flushEffects();

            await act(async () => {
                await result.current.handleSaveOrToggleEdit();
            });

            expect(result.current.isEditing).toBe(true);
        });

        it("should set isEditing to false when save succeeds", async () => {
            setup();
            jest.mocked(saveUserIngredient).mockResolvedValue(undefined);

            const { result } = renderHook(() => useIngredientCatalog());

            await flushEffects();

            await act(async () => {
                await result.current.handleSaveOrToggleEdit();
            });

            expect(result.current.isEditing).toBe(true);

            await act(async () => {
                await result.current.handleSaveOrToggleEdit();
            });

            expect(result.current.isEditing).toBe(false);
        });

        it("should keep isEditing true when save fails", async () => {
            setup();
            jest.mocked(saveUserIngredient).mockRejectedValue(
                new Error(MOCK_ERROR_NETWORK),
            );

            const { result } = renderHook(() => useIngredientCatalog());

            await flushEffects();

            await act(async () => {
                await result.current.handleSaveOrToggleEdit();
            });

            expect(result.current.isEditing).toBe(true);

            await act(async () => {
                await result.current.handleSaveOrToggleEdit();
            });

            expect(result.current.isEditing).toBe(true);
        });
    });

    describe("handleConfirmDelete", () => {
        const ingredient: PantryIngredient = {
            id: 1,
            unit_name: "kg",
            quantity_person_ingradient: 2,
        };

        it("should clear selectedIngredientToDelete when delete succeeds", async () => {
            setup();
            jest.mocked(deleteUserIngredient).mockResolvedValue(undefined);

            const { result } = renderHook(() => useIngredientCatalog());

            await flushEffects();

            act(() => {
                result.current.setSelectedIngredientToDelete(ingredient);
            });

            await act(async () => {
                await result.current.handleConfirmDelete();
            });

            expect(result.current.selectedIngredientToDelete).toBeNull();
        });

        it("should keep selectedIngredientToDelete when delete fails", async () => {
            setup();
            jest.mocked(deleteUserIngredient).mockRejectedValue(
                new Error(MOCK_ERROR_NETWORK),
            );

            const { result } = renderHook(() => useIngredientCatalog());

            await flushEffects();

            act(() => {
                result.current.setSelectedIngredientToDelete(ingredient);
            });

            await act(async () => {
                await result.current.handleConfirmDelete();
            });

            expect(result.current.selectedIngredientToDelete).toBe(ingredient);
        });

        it("should do nothing when no ingredient is selected to delete", async () => {
            setup();
            jest.mocked(deleteUserIngredient).mockResolvedValue(undefined);

            const { result } = renderHook(() => useIngredientCatalog());

            await flushEffects();

            await act(async () => {
                await result.current.handleConfirmDelete();
            });

            expect(deleteUserIngredient).not.toHaveBeenCalled();
            expect(result.current.selectedIngredientToDelete).toBeNull();
        });
    });

    describe("handleToggleQuantityEdit", () => {
        it("should set isEditing to false when starting quantity edit", async () => {
            setup();

            const { result } = renderHook(() => useIngredientCatalog());

            await flushEffects();

            await act(async () => {
                await result.current.handleSaveOrToggleEdit();
            });

            expect(result.current.isEditing).toBe(true);

            act(() => {
                result.current.handleToggleQuantityEdit();
            });

            expect(result.current.isEditing).toBe(false);
            expect(result.current.isEditingQuantity).toBe(true);
        });
    });

    describe("closeHistoryModal", () => {
        const ingredient: PantryIngredient = {
            id: 1,
            unit_name: "kg",
            quantity_person_ingradient: 2,
        };

        it("should clear the selected history ingredient and refetch", async () => {
            setup();

            const { result } = renderHook(() => useIngredientCatalog());

            await flushEffects();

            act(() => {
                result.current.setSelectedHistoryIngredient(ingredient);
            });

            expect(result.current.selectedHistoryIngredient).toBe(ingredient);

            jest.mocked(getUserIngredients).mockClear();

            await act(async () => {
                result.current.closeHistoryModal();
                await Promise.resolve();
            });

            expect(result.current.selectedHistoryIngredient).toBeNull();
            expect(getUserIngredients).toHaveBeenCalled();
        });
    });
});
