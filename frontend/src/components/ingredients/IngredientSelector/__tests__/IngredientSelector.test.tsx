import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IngredientSelector } from "components/ingredients/IngredientSelector";

const ALL_INGREDIENTS = [
    { id: 1, name: "Tomato", unit_name: "kg" },
    { id: 2, name: "Onion", unit_name: "kg" },
];

describe("IngredientSelector", () => {
    it("should render available ingredients as toggle buttons", () => {
        render(
            <IngredientSelector
                allIngredients={ALL_INGREDIENTS}
                personIngredients={[]}
                selectedIngredients={[]}
                onToggle={jest.fn()}
            />,
        );

        expect(
            screen.getByRole("button", { name: "Tomato" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Onion" }),
        ).toBeInTheDocument();
    });

    it("should exclude ingredients already in pantry", () => {
        render(
            <IngredientSelector
                allIngredients={ALL_INGREDIENTS}
                personIngredients={[
                    {
                        id: 1,
                        ingredient_name: "Tomato",
                        quantity_person_ingradient: 1,
                        unit_name: "kg",
                    },
                ]}
                selectedIngredients={[]}
                onToggle={jest.fn()}
            />,
        );

        expect(screen.queryByRole("button", { name: "Tomato" })).toBeNull();
        expect(
            screen.getByRole("button", { name: "Onion" }),
        ).toBeInTheDocument();
    });

    it("should call onToggle with the ingredient id when button is clicked", async () => {
        const onToggle = jest.fn();

        render(
            <IngredientSelector
                allIngredients={ALL_INGREDIENTS}
                personIngredients={[]}
                selectedIngredients={[]}
                onToggle={onToggle}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Tomato" }));

        expect(onToggle).toHaveBeenCalledWith(1);
    });

    it("should highlight selected ingredients differently from unselected", () => {
        render(
            <IngredientSelector
                allIngredients={ALL_INGREDIENTS}
                personIngredients={[]}
                selectedIngredients={[1]}
                onToggle={jest.fn()}
            />,
        );

        const selectedBtn = screen.getByRole("button", { name: "Tomato" });
        const unselectedBtn = screen.getByRole("button", { name: "Onion" });

        expect(selectedBtn.className).not.toBe(unselectedBtn.className);
    });
});
