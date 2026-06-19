import { render, screen } from "@testing-library/react";

import { IngredientPicker } from "components/recipes/IngredientPicker";

const INGREDIENTS = [
    { id: 1, name: "Potato", unit_name: "g" },
    { id: 2, name: "Onion", unit_name: "g" },
];

describe("IngredientPicker", () => {
    it("should render a button for each ingredient", () => {
        render(
            <IngredientPicker
                allIngredients={INGREDIENTS}
                selectedIds={[]}
                label="Ingredients"
                onToggle={jest.fn()}
            />,
        );

        expect(
            screen.getByRole("button", { name: "Potato" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Onion" }),
        ).toBeInTheDocument();
    });

    it("should apply selected style to selected ingredient", () => {
        render(
            <IngredientPicker
                allIngredients={INGREDIENTS}
                selectedIds={[1]}
                label="Ingredients"
                onToggle={jest.fn()}
            />,
        );

        expect(screen.getByRole("button", { name: "Potato" })).toHaveClass(
            "bg-green-500",
        );
        expect(screen.getByRole("button", { name: "Onion" })).toHaveClass(
            "bg-gray-300",
        );
    });
});
