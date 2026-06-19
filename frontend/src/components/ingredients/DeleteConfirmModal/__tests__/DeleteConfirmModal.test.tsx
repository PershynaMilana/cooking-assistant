import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DeleteConfirmModal } from "components/ingredients/DeleteConfirmModal";

const INGREDIENT = {
    id: 1,
    ingredient_name: "Tomato",
    quantity_person_ingradient: 1,
    unit_name: "kg",
};

describe("DeleteConfirmModal", () => {
    it("should render confirmation message with ingredient name and action buttons", () => {
        render(
            <DeleteConfirmModal
                ingredient={INGREDIENT}
                onConfirm={jest.fn()}
                onCancel={jest.fn()}
            />,
        );

        expect(
            screen.getByText(/Are you sure you want to delete the ingredient/),
        ).toBeInTheDocument();
        expect(screen.getByText(/Tomato/)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Confirm" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Cancel" }),
        ).toBeInTheDocument();
    });

    it("should match snapshot", () => {
        const { asFragment } = render(
            <DeleteConfirmModal
                ingredient={INGREDIENT}
                onConfirm={jest.fn()}
                onCancel={jest.fn()}
            />,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("should call onConfirm when Confirm button is clicked", async () => {
        const onConfirm = jest.fn();

        render(
            <DeleteConfirmModal
                ingredient={INGREDIENT}
                onConfirm={onConfirm}
                onCancel={jest.fn()}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("should call onCancel when Cancel button is clicked", async () => {
        const onCancel = jest.fn();

        render(
            <DeleteConfirmModal
                ingredient={INGREDIENT}
                onConfirm={jest.fn()}
                onCancel={onCancel}
            />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});
