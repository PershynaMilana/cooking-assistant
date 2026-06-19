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

import { mockJwtUser, setAuthToken } from "test/auth";
import { MOCK_ERROR_NETWORK } from "test/constants";

jest.mock("api/ingredientsApi");
jest.mock("api/userIngredientsApi");
jest.mock("jwt-decode");

const USER_ID = 5;

const setup = () => {
    setAuthToken();
    mockJwtUser(USER_ID);
    jest.mocked(getIngredients).mockResolvedValue([]);
    jest.mocked(getUserIngredients).mockResolvedValue([]);
    jest.mocked(updateQuantities).mockResolvedValue(undefined);
};

const flushEffects = async () => {
    await act(async () => {
        await Promise.resolve();
    });
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
    });
});
