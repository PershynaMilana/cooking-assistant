import { useCallback, useState } from "react";

import type {
    RecipeFormChangeMessages,
    RecipeFormCreateMessages,
    RecipeFormIngredient,
} from "types/recipe";

import { parseCookingTime } from "utils/cookingTimeUtils";

const isValidCookingTime = (
    cookingTime: string,
    setCookingTimeError: (e: string | null) => void,
    messages: {
        errorCookingTimeFormat: string;
        errorCookingTimeInvalid: string;
    },
): boolean => {
    if (cookingTime.split(":").length !== 2) {
        setCookingTimeError(messages.errorCookingTimeFormat);

        return false;
    }

    const parsed = parseCookingTime(cookingTime);

    if (parsed === null) {
        setCookingTimeError(messages.errorCookingTimeInvalid);

        return false;
    }

    return true;
};

export const useRecipeFormValidation = () => {
    const [error, setError] = useState<string | null>(null);
    const [typeError, setTypeError] = useState<string | null>(null);
    const [cookingTimeError, setCookingTimeError] = useState<string | null>(
        null,
    );

    const validateCreate = useCallback(
        (
            values: {
                title: string;
                content: string;
                selectedIngredients: RecipeFormIngredient[];
                selectedTypeId: number | null;
                cookingTime: string;
                servings: string;
            },
            messages: RecipeFormCreateMessages,
        ): boolean => {
            setError(null);
            setTypeError(null);
            setCookingTimeError(null);

            if (!values.title.trim()) {
                setError(messages.errorTitle);

                return false;
            }

            if (!values.content.trim()) {
                setError(messages.errorDescription);

                return false;
            }

            if (values.selectedIngredients.length === 0) {
                setError(messages.errorIngredients);

                return false;
            }

            if (values.selectedTypeId === null) {
                setTypeError(messages.errorType);

                return false;
            }

            if (
                !isValidCookingTime(
                    values.cookingTime,
                    setCookingTimeError,
                    messages,
                )
            ) {
                return false;
            }

            if (!values.servings.trim()) {
                setError(messages.errorServings);

                return false;
            }

            return true;
        },
        [],
    );

    const validateChange = useCallback(
        (
            values: { cookingTime: string; servings: string },
            messages: RecipeFormChangeMessages,
        ): boolean => {
            setError(null);
            setCookingTimeError(null);

            let valid = true;

            if (!values.servings.trim()) {
                setError(messages.errorServings);
                valid = false;
            }

            if (
                !isValidCookingTime(
                    values.cookingTime,
                    setCookingTimeError,
                    messages,
                )
            ) {
                valid = false;
            }

            return valid;
        },
        [],
    );

    return {
        error,
        setError,
        typeError,
        cookingTimeError,
        validateCreate,
        validateChange,
    };
};
