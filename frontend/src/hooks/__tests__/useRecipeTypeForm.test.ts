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

    it("should set loadError when fetching the type fails", async () => {
        jest.mocked(getRecipeTypeById).mockRejectedValue(
            new Error("Network error"),
        );

        const { result } = renderHook(() => useRecipeTypeForm("5"));

        await flush();

        expect(result.current.loadError).not.toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it("should set submitError when saving fails", async () => {
        jest.mocked(createRecipeType).mockRejectedValue(new Error("Conflict"));

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

        expect(result.current.submitError).not.toBeNull();
    });

    it("should clear submitError on the next submit attempt", async () => {
        jest.mocked(createRecipeType)
            .mockRejectedValueOnce(new Error("Conflict"))
            .mockResolvedValue(undefined);

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

        expect(result.current.submitError).not.toBeNull();

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.submitError).toBeNull();
    });

    it("should clear submitError when resubmitting with validation errors", async () => {
        jest.mocked(createRecipeType).mockRejectedValue(new Error("Conflict"));

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

        expect(result.current.submitError).not.toBeNull();

        act(() => {
            result.current.setField("description", "");
        });

        await act(async () => {
            await result.current.handleSubmit();
        });

        expect(result.current.submitError).toBeNull();
        expect(result.current.errors.description).toBeDefined();
    });

    it("should reset loadError when the id changes", async () => {
        jest.mocked(getRecipeTypeById)
            .mockRejectedValueOnce(new Error("Not found"))
            .mockResolvedValue(SAMPLE);

        const { result, rerender } = renderHook(
            ({ id }: { id: string }) => useRecipeTypeForm(id),
            { initialProps: { id: "5" } },
        );

        await flush();

        expect(result.current.loadError).not.toBeNull();

        rerender({ id: "7" });

        await flush();

        expect(result.current.loadError).toBeNull();
        expect(result.current.typeData.type_name).toBe("Soup");
    });
});
