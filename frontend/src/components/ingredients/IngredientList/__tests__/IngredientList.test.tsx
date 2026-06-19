import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IngredientList } from "components/ingredients/IngredientList";

const INGREDIENT = {
    id: 1,
    ingredient_name: "Tomato",
    quantity_person_ingradient: 3,
    unit_name: "kg",
    allergens: ["none"],
    days_to_expire: 7,
    storage_condition: "cool",
    seasonality: "summer",
    purchase_date: "2024-01-01",
};

describe("IngredientList", () => {
    it("should render empty state when no ingredients", () => {
        render(
            <IngredientList
                ingredients={[]}
                onOpenHistory={jest.fn()}
                onDelete={jest.fn()}
            />,
        );

        expect(
            screen.getByText("You currently have no ingredients."),
        ).toBeInTheDocument();
    });

    it("should render ingredient name and action buttons", () => {
        render(
            <IngredientList
                ingredients={[INGREDIENT]}
                onOpenHistory={jest.fn()}
                onDelete={jest.fn()}
            />,
        );

        expect(screen.getByText("Tomato")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Details" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Delete" }),
        ).toBeInTheDocument();
    });

    it("should call onOpenHistory with the ingredient when Details button is clicked", async () => {
        const onOpenHistory = jest.fn();

        render(
            <IngredientList
                ingredients={[INGREDIENT]}
                onOpenHistory={onOpenHistory}
                onDelete={jest.fn()}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Details" }));

        expect(onOpenHistory).toHaveBeenCalledWith(INGREDIENT);
    });

    it("should call onDelete with the ingredient when Delete button is clicked", async () => {
        const onDelete = jest.fn();

        render(
            <IngredientList
                ingredients={[INGREDIENT]}
                onOpenHistory={jest.fn()}
                onDelete={onDelete}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        expect(onDelete).toHaveBeenCalledWith(INGREDIENT);
    });
});
