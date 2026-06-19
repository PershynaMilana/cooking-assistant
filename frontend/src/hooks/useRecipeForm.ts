import { useCallback, useState } from "react";

import type {
    RecipeFormChangeMessages,
    RecipeFormCreateMessages,
    RecipeFormInitialValues,
} from "types/recipe";

import { useRecipeFormValidation } from "hooks/useRecipeFormValidation";
import { useSelectedIngredients } from "hooks/useSelectedIngredients";

export const useRecipeForm = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [cookingTime, setCookingTime] = useState("");
    const [servings, setServings] = useState("");
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

    const {
        selectedIngredients,
        setSelectedIngredients,
        toggleIngredientSelection,
        updateIngredientQuantity,
    } = useSelectedIngredients();

    const {
        error,
        setError,
        typeError,
        cookingTimeError,
        validateCreate: _validateCreate,
        validateChange: _validateChange,
    } = useRecipeFormValidation();

    const validateCreate = useCallback(
        (messages: RecipeFormCreateMessages) =>
            _validateCreate(
                {
                    title,
                    content,
                    selectedIngredients,
                    selectedTypeId,
                    cookingTime,
                    servings,
                },
                messages,
            ),
        [
            title,
            content,
            selectedIngredients,
            selectedTypeId,
            cookingTime,
            servings,
            _validateCreate,
        ],
    );

    const validateChange = useCallback(
        (messages: RecipeFormChangeMessages) =>
            _validateChange({ cookingTime, servings }, messages),
        [cookingTime, servings, _validateChange],
    );

    const setInitialValues = useCallback(
        (values: RecipeFormInitialValues) => {
            setTitle(values.title);
            setContent(values.content);
            setCookingTime(values.cookingTime);
            setServings(values.servings);
            setSelectedTypeId(values.selectedTypeId);
            setSelectedIngredients(values.selectedIngredients);
        },
        [setSelectedIngredients],
    );

    return {
        title,
        setTitle,
        content,
        setContent,
        cookingTime,
        setCookingTime,
        servings,
        setServings,
        selectedIngredients,
        selectedTypeId,
        setSelectedTypeId,
        error,
        setError,
        typeError,
        cookingTimeError,
        toggleIngredientSelection,
        updateIngredientQuantity,
        validateCreate,
        validateChange,
        setInitialValues,
    };
};
