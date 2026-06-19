import { useCallback, useState } from "react";

export interface MenuFormValues {
    menuTitle: string;
    menuDescription: string;
    selectedCategory: number | null;
    selectedRecipes: number[];
}

export interface MenuFormErrors {
    menuTitleError: string | null;
    menuDescriptionError: string | null;
    categoryError: string | null;
    recipesError: string | null;
}

export interface UseMenuFormOptions {
    errorMessages: {
        emptyTitle: string;
        emptyDescription: string;
        noCategory: string;
        noRecipes: string;
    };
}

export const useMenuForm = (options: UseMenuFormOptions) => {
    const { errorMessages } = options;
    const { emptyTitle, emptyDescription, noCategory, noRecipes } =
        errorMessages;

    const [menuTitle, setMenuTitle] = useState("");
    const [menuDescription, setMenuDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null,
    );
    const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);

    const [menuTitleError, setMenuTitleError] = useState<string | null>(null);
    const [menuDescriptionError, setMenuDescriptionError] = useState<
        string | null
    >(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [recipesError, setRecipesError] = useState<string | null>(null);

    const validateForm = useCallback((): boolean => {
        let valid = true;

        if (!menuTitle.trim()) {
            setMenuTitleError(emptyTitle);
            valid = false;
        } else {
            setMenuTitleError(null);
        }

        if (!menuDescription.trim()) {
            setMenuDescriptionError(emptyDescription);
            valid = false;
        } else {
            setMenuDescriptionError(null);
        }

        if (selectedCategory === null) {
            setCategoryError(noCategory);
            valid = false;
        } else {
            setCategoryError(null);
        }

        if (selectedRecipes.length === 0) {
            setRecipesError(noRecipes);
            valid = false;
        } else {
            setRecipesError(null);
        }

        return valid;
    }, [
        menuTitle,
        menuDescription,
        selectedCategory,
        selectedRecipes,
        emptyTitle,
        emptyDescription,
        noCategory,
        noRecipes,
    ]);

    const toggleRecipeSelection = useCallback((recipeId: number) => {
        setSelectedRecipes((prevSelected) =>
            prevSelected.includes(recipeId)
                ? prevSelected.filter((id) => id !== recipeId)
                : [...prevSelected, recipeId],
        );
    }, []);

    const setInitialValues = useCallback(
        (values: MenuFormValues) => {
            setMenuTitle(values.menuTitle);
            setMenuDescription(values.menuDescription);
            setSelectedCategory(values.selectedCategory);
            setSelectedRecipes(values.selectedRecipes);
        },
        [
            setMenuTitle,
            setMenuDescription,
            setSelectedCategory,
            setSelectedRecipes,
        ],
    );

    return {
        menuTitle,
        menuDescription,
        selectedCategory,
        selectedRecipes,
        errors: {
            menuTitleError,
            menuDescriptionError,
            categoryError,
            recipesError,
        } satisfies MenuFormErrors,
        setMenuTitle,
        setMenuDescription,
        setSelectedCategory,
        validateForm,
        toggleRecipeSelection,
        setInitialValues,
    };
};
