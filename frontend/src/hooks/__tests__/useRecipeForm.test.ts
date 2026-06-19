import { act, renderHook } from "@testing-library/react";

import type { Ingredient } from "types/ingredient";

import { useRecipeForm } from "hooks/useRecipeForm";

const INGREDIENT: Ingredient = { id: 1, name: "Egg", unit_name: "pcs" };

const CREATE_MESSAGES = {
    errorTitle: "Title required",
    errorDescription: "Description required",
    errorIngredients: "Pick an ingredient",
    errorType: "Pick a type",
    errorCookingTimeFormat: "Bad time format",
    errorCookingTimeInvalid: "Invalid time",
    errorServings: "Servings required",
};

const fillValid = (form: ReturnType<typeof useRecipeForm>) => {
    form.setInitialValues({
        title: "Soup",
        content: "boil",
        cookingTime: "0:30",
        servings: "2",
        selectedTypeId: 5,
        selectedIngredients: [
            { id: 1, name: "Egg", quantity: 1, unit_name: "pcs" },
        ],
    });
};

describe("useRecipeForm", () => {
    it("should initialise with empty state", () => {
        const { result } = renderHook(() => useRecipeForm());

        expect(result.current.title).toBe("");
        expect(result.current.selectedIngredients).toEqual([]);
        expect(result.current.selectedTypeId).toBeNull();
    });

    it("should update fields through their setters", () => {
        const { result } = renderHook(() => useRecipeForm());

        act(() => {
            result.current.setTitle("Borscht");
            result.current.setServings("4");
        });

        expect(result.current.title).toBe("Borscht");
        expect(result.current.servings).toBe("4");
    });

    it("should toggle an ingredient into and back out of the selection", () => {
        const { result } = renderHook(() => useRecipeForm());

        act(() => {
            result.current.toggleIngredientSelection(INGREDIENT);
        });

        expect(result.current.selectedIngredients).toHaveLength(1);

        act(() => {
            result.current.toggleIngredientSelection(INGREDIENT);
        });

        expect(result.current.selectedIngredients).toHaveLength(0);
    });

    it("should clamp an ingredient quantity to a minimum of one", () => {
        const { result } = renderHook(() => useRecipeForm());

        act(() => {
            result.current.toggleIngredientSelection(INGREDIENT);
        });
        act(() => {
            result.current.updateIngredientQuantity(INGREDIENT.id, 0);
        });

        expect(result.current.selectedIngredients[0].quantity).toBe(1);
    });

    it("should populate every field via setInitialValues", () => {
        const { result } = renderHook(() => useRecipeForm());

        act(() => {
            fillValid(result.current);
        });

        expect(result.current.title).toBe("Soup");
        expect(result.current.cookingTime).toBe("0:30");
        expect(result.current.selectedTypeId).toBe(5);
        expect(result.current.selectedIngredients).toHaveLength(1);
    });

    it("should fail validateCreate and set the title error when empty", () => {
        const { result } = renderHook(() => useRecipeForm());

        let valid = true;

        act(() => {
            valid = result.current.validateCreate(CREATE_MESSAGES);
        });

        expect(valid).toBe(false);
        expect(result.current.error).toBe(CREATE_MESSAGES.errorTitle);
    });

    it("should pass validateCreate when every field is valid", () => {
        const { result } = renderHook(() => useRecipeForm());

        act(() => {
            fillValid(result.current);
        });

        let valid = false;

        act(() => {
            valid = result.current.validateCreate(CREATE_MESSAGES);
        });

        expect(valid).toBe(true);
        expect(result.current.error).toBeNull();
    });
});
