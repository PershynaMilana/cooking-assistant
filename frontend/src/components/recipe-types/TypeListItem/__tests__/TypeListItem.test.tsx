import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TypeListItem } from "components/recipe-types/TypeListItem";

const TYPE = { id: 1, type_name: "Soup", description: "warm" };

describe("TypeListItem", () => {
    it("should render the type name and the edit and delete buttons", () => {
        render(
            <ul>
                <TypeListItem
                    type={TYPE}
                    onEdit={jest.fn()}
                    onDelete={jest.fn()}
                    editLabel="Edit"
                    deleteLabel="Delete"
                />
            </ul>,
        );

        expect(screen.getByText("Soup")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Edit" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Delete" }),
        ).toBeInTheDocument();
    });

    it("should call onEdit and onDelete when the buttons are clicked", async () => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();

        render(
            <ul>
                <TypeListItem
                    type={TYPE}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    editLabel="Edit"
                    deleteLabel="Delete"
                />
            </ul>,
        );

        await userEvent.click(screen.getByRole("button", { name: "Edit" }));
        await userEvent.click(screen.getByRole("button", { name: "Delete" }));

        expect(onEdit).toHaveBeenCalledTimes(1);
        expect(onDelete).toHaveBeenCalledTimes(1);
    });
});
