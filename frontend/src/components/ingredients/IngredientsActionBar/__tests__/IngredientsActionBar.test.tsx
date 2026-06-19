import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IngredientsActionBar } from "components/ingredients/IngredientsActionBar";

import { BTN_EDIT_INGREDIENTS } from "test/constants";

const EDIT_QUANTITIES = "Edit quantities";

describe("IngredientsActionBar", () => {
    it("should show 'Edit ingredients' button when not editing", () => {
        render(
            <IngredientsActionBar
                isEditing={false}
                onSaveOrEdit={jest.fn()}
                onEditQuantities={jest.fn()}
            />,
        );

        expect(
            screen.getByRole("button", { name: BTN_EDIT_INGREDIENTS }),
        ).toBeInTheDocument();
    });

    it("should show 'Save' button when editing", () => {
        render(
            <IngredientsActionBar
                isEditing={true}
                onSaveOrEdit={jest.fn()}
                onEditQuantities={jest.fn()}
            />,
        );

        expect(
            screen.getByRole("button", { name: "Save" }),
        ).toBeInTheDocument();
    });

    it("should hide 'Edit quantities' button when editing", () => {
        render(
            <IngredientsActionBar
                isEditing={true}
                onSaveOrEdit={jest.fn()}
                onEditQuantities={jest.fn()}
            />,
        );

        expect(
            screen.queryByRole("button", { name: EDIT_QUANTITIES }),
        ).not.toBeInTheDocument();
    });

    it("should show 'Edit quantities' button when not editing", () => {
        render(
            <IngredientsActionBar
                isEditing={false}
                onSaveOrEdit={jest.fn()}
                onEditQuantities={jest.fn()}
            />,
        );

        expect(
            screen.getByRole("button", { name: EDIT_QUANTITIES }),
        ).toBeInTheDocument();
    });

    it("should call onSaveOrEdit when the main button is clicked", async () => {
        const onSaveOrEdit = jest.fn();

        render(
            <IngredientsActionBar
                isEditing={false}
                onSaveOrEdit={onSaveOrEdit}
                onEditQuantities={jest.fn()}
            />,
        );

        await userEvent.click(
            screen.getByRole("button", { name: BTN_EDIT_INGREDIENTS }),
        );

        expect(onSaveOrEdit).toHaveBeenCalledTimes(1);
    });

    it("should match snapshot in view mode", () => {
        const { asFragment } = render(
            <IngredientsActionBar
                isEditing={false}
                onSaveOrEdit={jest.fn()}
                onEditQuantities={jest.fn()}
            />,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("should match snapshot in edit mode", () => {
        const { asFragment } = render(
            <IngredientsActionBar
                isEditing={true}
                onSaveOrEdit={jest.fn()}
                onEditQuantities={jest.fn()}
            />,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("should call onEditQuantities when the Edit quantities button is clicked", async () => {
        const onEditQuantities = jest.fn();

        render(
            <IngredientsActionBar
                isEditing={false}
                onSaveOrEdit={jest.fn()}
                onEditQuantities={onEditQuantities}
            />,
        );

        await userEvent.click(
            screen.getByRole("button", { name: EDIT_QUANTITIES }),
        );

        expect(onEditQuantities).toHaveBeenCalledTimes(1);
    });
});
