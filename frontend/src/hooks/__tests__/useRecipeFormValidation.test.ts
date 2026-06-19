import { act, renderHook } from "@testing-library/react";

import { useRecipeFormValidation } from "hooks/useRecipeFormValidation";

const MESSAGES = {
    errorTitle: "Title is required.",
    errorDescription: "Description is required.",
    errorIngredients: "Add at least one ingredient.",
    errorType: "Select a recipe type.",
    errorCookingTimeFormat: "Use HH:MM format.",
    errorCookingTimeInvalid: "Cooking time is invalid.",
    errorServings: "Servings is required.",
};

const CHANGE_MESSAGES = {
    errorCookingTimeFormat: "Use HH:MM format.",
    errorCookingTimeInvalid: "Cooking time is invalid.",
    errorServings: "Servings is required.",
};

const VALID_CREATE = {
    title: "Borscht",
    content: "Boil beets.",
    selectedIngredients: [
        { id: 1, name: "Beet", quantity: 1, unit_name: "kg" },
    ],
    selectedTypeId: 2,
    cookingTime: "01:30",
    servings: "4",
};

describe("useRecipeFormValidation", () => {
    it("should return false and set error when title is empty", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateCreate(
                { ...VALID_CREATE, title: "" },
                MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.error).toBe(MESSAGES.errorTitle);
    });

    it("should return false and set error when content is empty", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateCreate(
                { ...VALID_CREATE, content: "" },
                MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.error).toBe(MESSAGES.errorDescription);
    });

    it("should return false and set error when no ingredients selected", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateCreate(
                { ...VALID_CREATE, selectedIngredients: [] },
                MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.error).toBe(MESSAGES.errorIngredients);
    });

    it("should return false and set typeError when no type selected", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateCreate(
                { ...VALID_CREATE, selectedTypeId: null },
                MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.typeError).toBe(MESSAGES.errorType);
    });

    it("should return false and set cookingTimeError when time has no colon", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateCreate(
                { ...VALID_CREATE, cookingTime: "90" },
                MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.cookingTimeError).toBe(
            MESSAGES.errorCookingTimeFormat,
        );
    });

    it("should return false and set cookingTimeError when time parts are not numbers", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateCreate(
                { ...VALID_CREATE, cookingTime: "ab:cd" },
                MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.cookingTimeError).toBe(
            MESSAGES.errorCookingTimeInvalid,
        );
    });

    it("should return false and set error when servings is empty", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateCreate(
                { ...VALID_CREATE, servings: "" },
                MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.error).toBe(MESSAGES.errorServings);
    });

    it("should return true and clear all errors when all create fields are valid", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = false;

        act(() => {
            valid = result.current.validateCreate(VALID_CREATE, MESSAGES);
        });

        expect(valid).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.typeError).toBeNull();
        expect(result.current.cookingTimeError).toBeNull();
    });

    it("should validateChange: return false when servings is empty", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateChange(
                { cookingTime: "01:00", servings: "" },
                CHANGE_MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.error).toBe(CHANGE_MESSAGES.errorServings);
    });

    it("should validateChange: return false when cookingTime format is invalid", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = true;

        act(() => {
            valid = result.current.validateChange(
                { cookingTime: "invalid", servings: "2" },
                CHANGE_MESSAGES,
            );
        });

        expect(valid).toBe(false);
        expect(result.current.cookingTimeError).toBe(
            CHANGE_MESSAGES.errorCookingTimeFormat,
        );
    });

    it("should validateChange: return true for valid time and servings", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = false;

        act(() => {
            valid = result.current.validateChange(
                { cookingTime: "00:45", servings: "2" },
                CHANGE_MESSAGES,
            );
        });

        expect(valid).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.cookingTimeError).toBeNull();
    });

    it("should validateChange: skip title, content, ingredients, and type checks", () => {
        const { result } = renderHook(() => useRecipeFormValidation());

        let valid = false;

        act(() => {
            valid = result.current.validateChange(
                { cookingTime: "00:30", servings: "1" },
                CHANGE_MESSAGES,
            );
        });

        expect(valid).toBe(true);
        expect(result.current.typeError).toBeNull();
    });
});
