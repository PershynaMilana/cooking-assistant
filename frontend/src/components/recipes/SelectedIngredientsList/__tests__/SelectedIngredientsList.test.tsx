import { render, screen } from "@testing-library/react";

import { SelectedIngredientsList } from "components/recipes/SelectedIngredientsList";

const INGREDIENTS = [{ id: 1, name: "Potato", quantity: 3, unit_name: "g" }];

describe("SelectedIngredientsList", () => {
    it("should render heading, ingredient name, quantity input and unit", () => {
        render(
            <SelectedIngredientsList
                ingredients={INGREDIENTS}
                heading="Selected Ingredients"
                onQuantityChange={jest.fn()}
            />,
        );

        expect(screen.getByText("Selected Ingredients")).toBeInTheDocument();
        expect(screen.getByText("Potato")).toBeInTheDocument();
        expect(screen.getByRole("spinbutton")).toHaveValue(3);
        expect(screen.getByText("g")).toBeInTheDocument();
    });
});
