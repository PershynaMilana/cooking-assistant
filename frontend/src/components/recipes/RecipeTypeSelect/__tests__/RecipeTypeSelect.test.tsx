import { render, screen } from "@testing-library/react";

import { RecipeTypeSelect } from "components/recipes/RecipeTypeSelect";

const TYPES = [{ id: 1, type_name: "Soup", description: "" }];

describe("RecipeTypeSelect", () => {
    it("should render label, placeholder option and type options", () => {
        render(
            <RecipeTypeSelect
                id="recipe-type"
                label="Recipe Type"
                placeholder="Select recipe type"
                types={TYPES}
                value={null}
                error={null}
                onChange={jest.fn()}
            />,
        );

        expect(screen.getByLabelText("Recipe Type")).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: "Select recipe type" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: "Soup" }),
        ).toBeInTheDocument();
    });

    it("should render error message when provided", () => {
        render(
            <RecipeTypeSelect
                id="recipe-type"
                label="Recipe Type"
                placeholder="Select"
                types={[]}
                value={null}
                error="Please select a recipe type."
                onChange={jest.fn()}
            />,
        );

        expect(
            screen.getByText("Please select a recipe type."),
        ).toBeInTheDocument();
    });
});
