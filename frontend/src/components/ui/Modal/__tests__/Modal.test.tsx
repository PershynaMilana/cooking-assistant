import { render, screen } from "@testing-library/react";

import { Modal } from "components/ui/Modal";

import { BTN_DELETE_RECIPE } from "test/constants";

const MESSAGE = "Are you sure you want to delete this recipe?";

describe("Modal", () => {
    it("should show the title and message when open", () => {
        render(
            <Modal
                isOpen
                title={BTN_DELETE_RECIPE}
                message={MESSAGE}
                onClose={jest.fn()}
                onConfirm={jest.fn()}
            />,
        );

        expect(screen.getByText(BTN_DELETE_RECIPE)).toBeInTheDocument();
        expect(screen.getByText(MESSAGE)).toBeInTheDocument();
    });

    it("should match snapshot when open", () => {
        const { asFragment } = render(
            <Modal
                isOpen
                title={BTN_DELETE_RECIPE}
                message={MESSAGE}
                onClose={jest.fn()}
                onConfirm={jest.fn()}
            />,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it("should render the error when provided", () => {
        render(
            <Modal
                isOpen
                title={BTN_DELETE_RECIPE}
                message={MESSAGE}
                onClose={jest.fn()}
                onConfirm={jest.fn()}
                error="Something went wrong"
            />,
        );

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("should disable the confirm button when isConfirmDisabled is true", () => {
        render(
            <Modal
                isOpen
                title={BTN_DELETE_RECIPE}
                message={MESSAGE}
                onClose={jest.fn()}
                onConfirm={jest.fn()}
                isConfirmDisabled
            />,
        );

        expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
    });
});
