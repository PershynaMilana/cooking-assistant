import { render, screen } from "@testing-library/react";
import Modal from "../Modal";

const TITLE = "Delete recipe";
const MESSAGE = "Are you sure you want to delete this recipe?";

describe("Modal", () => {
    it("should show the title and message when open", () => {
        render(
            <Modal
                isOpen
                title={TITLE}
                message={MESSAGE}
                onClose={jest.fn()}
                onConfirm={jest.fn()}
            />,
        );

        expect(screen.getByText(TITLE)).toBeInTheDocument();
        expect(screen.getByText(MESSAGE)).toBeInTheDocument();
    });
});
