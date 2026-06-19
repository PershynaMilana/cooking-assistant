import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuOwnerActions } from "components/menu/MenuOwnerActions";

import { BTN_DELETE_MENU } from "test/constants";
import { renderWithRouter } from "test/router";

describe("MenuOwnerActions", () => {
    it("should render edit and delete buttons", () => {
        renderWithRouter(<MenuOwnerActions menuId={42} onDelete={jest.fn()} />);

        expect(
            screen.getByRole("button", { name: "Edit menu" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: BTN_DELETE_MENU }),
        ).toBeInTheDocument();
    });

    it("should call onDelete when Delete button is clicked", async () => {
        const onDelete = jest.fn();

        renderWithRouter(<MenuOwnerActions menuId={42} onDelete={onDelete} />);

        await userEvent.click(
            screen.getByRole("button", { name: BTN_DELETE_MENU }),
        );

        expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it("should link to the edit page for the given menuId", () => {
        renderWithRouter(<MenuOwnerActions menuId={42} onDelete={jest.fn()} />);

        expect(screen.getByRole("link", { name: "Edit menu" })).toHaveAttribute(
            "href",
            "/change-menu/42",
        );
    });
});
