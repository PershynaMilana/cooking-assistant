import { act, renderHook } from "@testing-library/react";

import { getIngredients } from "api/ingredientsApi";
import {
    deleteUserIngredient,
    getUserIngredients,
    saveUserIngredient,
} from "api/userIngredientsApi";

import { useIngredientsData } from "hooks/useIngredientsData";

import { MOCK_ERROR_NETWORK } from "test/constants";
import { flushMicrotasks } from "test/flush";

jest.mock("api/ingredientsApi");
jest.mock("api/userIngredientsApi");

const setup = () => {
    jest.mocked(getIngredients).mockResolvedValue([]);
    jest.mocked(getUserIngredients).mockResolvedValue([]);
};

const makeUnauthorizedError = () =>
    Object.assign(new Error(), {
        isAxiosError: true,
        response: { status: 401 },
    });

describe("useIngredientsData", () => {
    describe("data loading", () => {
        it("should sort the loaded ingredients by name", async () => {
            jest.mocked(getIngredients).mockResolvedValue([
                { id: 1, name: "Banana", unit_name: "kg" },
                { id: 2, name: "Apple", unit_name: "kg" },
            ]);
            jest.mocked(getUserIngredients).mockResolvedValue([]);

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            expect(
                result.current.allIngredients.map((item) => item.name),
            ).toEqual(["Apple", "Banana"]);
        });

        it("should map the loaded pantry ingredients with their ingredient id", async () => {
            jest.mocked(getIngredients).mockResolvedValue([]);
            jest.mocked(getUserIngredients).mockResolvedValue([
                {
                    ingredient_id: 5,
                    ingredient_name: "Apple",
                    unit_name: "kg",
                    quantity_person_ingradient: 2,
                },
            ]);

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            expect(result.current.personIngredients).toEqual([
                {
                    id: 5,
                    ingredient_id: 5,
                    ingredient_name: "Apple",
                    unit_name: "kg",
                    quantity_person_ingradient: 2,
                },
            ]);
            expect(result.current.selectedIngredients).toEqual([5]);
        });

        it("should keep ingredients empty when getIngredients fails", async () => {
            jest.mocked(getIngredients).mockRejectedValue(
                new Error(MOCK_ERROR_NETWORK),
            );
            jest.mocked(getUserIngredients).mockResolvedValue([]);

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            expect(result.current.allIngredients).toEqual([]);
        });

        it("should keep selected ingredients empty when getUserIngredients fails", async () => {
            jest.mocked(getIngredients).mockResolvedValue([]);
            jest.mocked(getUserIngredients).mockRejectedValue(
                new Error(MOCK_ERROR_NETWORK),
            );

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            expect(result.current.selectedIngredients).toEqual([]);
        });
    });

    describe("saveNewIngredients", () => {
        it("should save the selected ingredients that are not yet in the pantry", async () => {
            jest.mocked(getIngredients).mockResolvedValue([
                { id: 1, name: "Apple", unit_name: "kg" },
            ]);
            jest.mocked(getUserIngredients).mockResolvedValue([]);
            jest.mocked(saveUserIngredient).mockResolvedValue(undefined);

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            act(() => {
                result.current.toggleIngredientSelection(1);
            });

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.saveNewIngredients();
            });

            expect(saveUserIngredient).toHaveBeenCalledWith({
                ingredients: [
                    {
                        id: 1,
                        ingredient_name: "Apple",
                        quantity_person_ingradient: 1,
                    },
                ],
            });
            expect(returnValue).toBe(true);
        });

        it("should return true when save and refresh succeed", async () => {
            setup();
            jest.mocked(saveUserIngredient).mockResolvedValue(undefined);

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.saveNewIngredients();
            });

            expect(returnValue).toBe(true);
        });

        it("should return false when saveUserIngredient API fails", async () => {
            setup();
            jest.mocked(saveUserIngredient).mockRejectedValue(
                new Error(MOCK_ERROR_NETWORK),
            );

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.saveNewIngredients();
            });

            expect(returnValue).toBe(false);
        });

        it("should return false when the api responds with 401", async () => {
            setup();
            jest.mocked(saveUserIngredient).mockRejectedValue(
                makeUnauthorizedError(),
            );

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.saveNewIngredients();
            });

            expect(returnValue).toBe(false);
        });
    });

    describe("toggleIngredientSelection", () => {
        it("should add then remove an ingredient from the selection", async () => {
            setup();

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            act(() => {
                result.current.toggleIngredientSelection(1);
            });

            expect(result.current.selectedIngredients).toEqual([1]);

            act(() => {
                result.current.toggleIngredientSelection(1);
            });

            expect(result.current.selectedIngredients).toEqual([]);
        });
    });

    describe("removeIngredient", () => {
        it("should return true when delete succeeds", async () => {
            setup();
            jest.mocked(deleteUserIngredient).mockResolvedValue(undefined);

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.removeIngredient(1);
            });

            expect(returnValue).toBe(true);
        });

        it("should return false when deleteUserIngredient API fails", async () => {
            setup();
            jest.mocked(deleteUserIngredient).mockRejectedValue(
                new Error(MOCK_ERROR_NETWORK),
            );

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.removeIngredient(1);
            });

            expect(returnValue).toBe(false);
        });

        it("should return false when the api responds with 401", async () => {
            setup();
            jest.mocked(deleteUserIngredient).mockRejectedValue(
                makeUnauthorizedError(),
            );

            const { result } = renderHook(() => useIngredientsData());

            await flushMicrotasks();

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.removeIngredient(1);
            });

            expect(returnValue).toBe(false);
        });
    });
});
