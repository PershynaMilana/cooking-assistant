import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QuantityEditor } from "components/ingredients/QuantityEditor";

const INGREDIENT = {
    id: 1,
    ingredient_name: "Tomato",
    quantity_person_ingradient: 3,
    unit_name: "kg",
};

describe("QuantityEditor", () => {
    it("should render ingredient name, quantity input and save button", () => {
        render(
            <QuantityEditor
                ingredients={[INGREDIENT]}
                onQuantityChange={jest.fn()}
                onSave={jest.fn()}
            />,
        );

        expect(screen.getByText("Tomato")).toBeInTheDocument();
        expect(screen.getByRole("spinbutton")).toHaveValue(3);
        expect(
            screen.getByRole("button", { name: "Save quantities" }),
        ).toBeInTheDocument();
    });

    it("should call onQuantityChange with ingredient id and new value when input changes", async () => {
        const onQuantityChange = jest.fn();

        render(
            <QuantityEditor
                ingredients={[INGREDIENT]}
                onQuantityChange={onQuantityChange}
                onSave={jest.fn()}
            />,
        );

        const input = screen.getByRole("spinbutton");

        await userEvent.type(input, "7");

        expect(onQuantityChange).toHaveBeenCalledWith(INGREDIENT.id, 37);
    });

    it("should not call onQuantityChange when the input is cleared", async () => {
        const onQuantityChange = jest.fn();

        render(
            <QuantityEditor
                ingredients={[INGREDIENT]}
                onQuantityChange={onQuantityChange}
                onSave={jest.fn()}
            />,
        );

        await userEvent.clear(screen.getByRole("spinbutton"));

        expect(onQuantityChange).not.toHaveBeenCalled();
    });

    it("should call onSave when the Save quantities button is clicked", async () => {
        const onSave = jest.fn();

        render(
            <QuantityEditor
                ingredients={[INGREDIENT]}
                onQuantityChange={jest.fn()}
                onSave={onSave}
            />,
        );

        await userEvent.click(
            screen.getByRole("button", { name: "Save quantities" }),
        );

        expect(onSave).toHaveBeenCalledTimes(1);
    });
});
