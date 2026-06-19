import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "constants/routes";
import type { RecipeTypeErrors, RecipeTypeFormData } from "types/recipeType";

import {
    createRecipeType,
    getRecipeTypeById,
    updateRecipeType,
} from "api/recipeTypesApi";

const EMPTY_FORM: RecipeTypeFormData = { type_name: "", description: "" };

// add/edit form logic for a recipe type. With an id it loads the existing type and
// updates on submit; without one it creates. Validation, navigation and i18n error
// messages live here so AddTypePage/EditRecipeType stay thin.
export const useRecipeTypeForm = (id?: string) => {
    const { t } = useTranslation("recipeTypes");
    const navigate = useNavigate();

    const [typeData, setTypeData] = useState<RecipeTypeFormData>(EMPTY_FORM);
    const [errors, setErrors] = useState<RecipeTypeErrors>({});
    const [isLoading, setIsLoading] = useState(Boolean(id));

    useEffect(() => {
        if (!id) {
            return;
        }

        const load = async () => {
            try {
                const data = await getRecipeTypeById(id);

                setTypeData(data);
            } catch (error) {
                console.error("Error loading recipe type:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, [id]);

    const setField = useCallback(
        (field: keyof RecipeTypeFormData, value: string) => {
            setTypeData((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        },
        [],
    );

    const validate = useCallback((): boolean => {
        const requiredError = t("form.requiredError");
        const nextErrors: RecipeTypeErrors = {};

        if (!typeData.type_name) {
            nextErrors.type_name = requiredError;
        }
        if (!typeData.description) {
            nextErrors.description = requiredError;
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }, [t, typeData]);

    const handleSubmit = useCallback(async () => {
        if (!validate()) {
            return;
        }

        try {
            if (id) {
                await updateRecipeType(id, typeData);
            } else {
                await createRecipeType(typeData);
            }

            navigate(ROUTES.recipeTypes);
        } catch (error) {
            console.error("Error saving recipe type:", error);
        }
    }, [id, navigate, typeData, validate]);

    return { typeData, errors, isLoading, setField, handleSubmit };
};
