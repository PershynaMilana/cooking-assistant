import { render, screen } from "@testing-library/react";

import { RecipeIngredientsList } from "components/recipes/RecipeIngredientsList";

const INGREDIENTS = [
    { id: 1, name: "Tomato", quantity_recipe_ingredients: 2, unit_name: "kg" },
    { id: 2, name: "Onion", quantity_recipe_ingredients: 1, unit_name: "pc" },
];

describe("RecipeIngredientsList", () => {
    it("should render the heading and ingredients sorted alphabetically", () => {
        render(
            <RecipeIngredientsList
                ingredients={INGREDIENTS}
                heading="Ingredients:"
            />,
        );

        expect(screen.getByText("Ingredients:")).toBeInTheDocument();

        const items = screen.getAllByRole("listitem");

        expect(items[0]).toHaveTextContent("Onion");
        expect(items[1]).toHaveTextContent("Tomato");
    });
});
