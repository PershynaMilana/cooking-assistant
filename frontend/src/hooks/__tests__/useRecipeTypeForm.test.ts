import { act, renderHook } from "@testing-library/react";
import type * as ReactRouterDom from "react-router-dom";

import {
    createRecipeType,
    getRecipeTypeById,
    updateRecipeType,
} from "api/recipeTypesApi";

import { useRecipeTypeForm } from "hooks/useRecipeTypeForm";

import { mockNavigate } from "test/router";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual<typeof ReactRouterDom>("react-router-dom"),
    useNavigate: () => mockNavigate,
}));
jest.mock("api/recipeTypesApi");

const SAMPLE = { type_name: "Soup", description: "warm" };

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

describe("useRecipeTypeForm", () => {
    it("should create a recipe type and navigate to the list on submit", async () => {
        jest.mocked(createRecipeType).mockResolvedValue(undefined);

        const { result } = renderHook(() => useRecipeTypeForm());

        act(() => {
            result.current.setField("type_name", "Dessert");
        });
        act(() => {
            result.current.setField("description", "Sweet");
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(createRecipeType)).toHaveBeenCalledWith({
            type_name: "Dessert",
            description: "Sweet",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/types");
    });

    it("should set errors and not submit when fields are empty", async () => {
        const { result } = renderHook(() => useRecipeTypeForm());

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(createRecipeType)).not.toHaveBeenCalled();
        expect(result.current.errors.type_name).toBe(
            "Please fill out this field.",
        );
    });

    it("should load an existing type in edit mode", async () => {
        jest.mocked(getRecipeTypeById).mockResolvedValue(SAMPLE);

        const { result } = renderHook(() => useRecipeTypeForm("5"));

        await flush();

        expect(result.current.typeData.type_name).toBe("Soup");
        expect(result.current.isLoading).toBe(false);
    });

    it("should update an existing type on submit in edit mode", async () => {
        jest.mocked(getRecipeTypeById).mockResolvedValue(SAMPLE);
        jest.mocked(updateRecipeType).mockResolvedValue(undefined);

        const { result } = renderHook(() => useRecipeTypeForm("5"));

        await flush();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(jest.mocked(updateRecipeType)).toHaveBeenCalledWith("5", SAMPLE);
    });
});
