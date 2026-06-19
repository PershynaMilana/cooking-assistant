import { render, screen } from "@testing-library/react";

import { MenuFormFields } from "components/forms/MenuFormFields";

const FORM = {
    menuTitle: "Test menu",
    menuDescription: "",
    selectedCategory: null,
    selectedRecipes: [],
    errors: {
        menuTitleError: null,
        menuDescriptionError: null,
        categoryError: null,
        recipesError: null,
    },
    setMenuTitle: jest.fn(),
    setMenuDescription: jest.fn(),
    setSelectedCategory: jest.fn(),
    validateForm: jest.fn(),
    toggleRecipeSelection: jest.fn(),
    setInitialValues: jest.fn(),
};

describe("MenuFormFields", () => {
    it("should render all form fields with correct labels", () => {
        render(
            <MenuFormFields
                form={FORM}
                categories={[]}
                allRecipes={[]}
                idPrefix="create-menu"
                keyPrefix="createMenuPage"
            />,
        );

        expect(screen.getByLabelText("Menu title")).toBeInTheDocument();
        expect(screen.getByLabelText("Menu description")).toBeInTheDocument();
        expect(screen.getByLabelText("Menu category")).toBeInTheDocument();
    });
});
