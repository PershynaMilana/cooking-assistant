import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MODAL_TYPE } from "redux/slices/uiSlice";

import { Header } from "components/layout/Header";

import { renderWithRouter } from "test/router";

describe("Header", () => {
    it("should show login and register links on the login page", () => {
        renderWithRouter(<Header />, ["/login"]);

        expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Register" }),
        ).toBeInTheDocument();
    });

    it("should open the logout confirmation modal when the logout button is clicked", async () => {
        const { store } = renderWithRouter(<Header />, ["/main"]);

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));

        expect(store.getState().ui.modal).toEqual(
            expect.objectContaining({ type: MODAL_TYPE.logout }),
        );
    });
});
