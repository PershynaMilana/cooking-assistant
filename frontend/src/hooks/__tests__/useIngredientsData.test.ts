import { act, renderHook } from "@testing-library/react";

import { getIngredients } from "api/ingredientsApi";
import {
    deleteUserIngredient,
    getUserIngredients,
    saveUserIngredient,
} from "api/userIngredientsApi";

import { useIngredientsData } from "hooks/useIngredientsData";

import { MOCK_ERROR_NETWORK } from "test/constants";

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
    describe("saveNewIngredients", () => {
        it("should return true when save and refresh succeed", async () => {
            setup();
            jest.mocked(saveUserIngredient).mockResolvedValue(undefined);

            const { result } = renderHook(() => useIngredientsData());

            await act(async () => {
                await Promise.resolve();
            });

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

            await act(async () => {
                await Promise.resolve();
            });

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

            await act(async () => {
                await Promise.resolve();
            });

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.saveNewIngredients();
            });

            expect(returnValue).toBe(false);
        });
    });

    describe("removeIngredient", () => {
        it("should return true when delete succeeds", async () => {
            setup();
            jest.mocked(deleteUserIngredient).mockResolvedValue(undefined);

            const { result } = renderHook(() => useIngredientsData());

            await act(async () => {
                await Promise.resolve();
            });

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

            await act(async () => {
                await Promise.resolve();
            });

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

            await act(async () => {
                await Promise.resolve();
            });

            let returnValue: boolean | undefined;

            await act(async () => {
                returnValue = await result.current.removeIngredient(1);
            });

            expect(returnValue).toBe(false);
        });
    });
});
