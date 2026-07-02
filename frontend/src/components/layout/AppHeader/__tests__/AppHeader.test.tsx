import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { API_ROUTES } from "api/endpoints";

import { MODAL_TYPE } from "redux/slices/uiSlice";

import { AppHeader } from "components/layout/AppHeader";

import { mockGetByUrl } from "test/apiClientMock";
import { renderWithProviders } from "test/router";

jest.mock("api/client");

describe("AppHeader", () => {
    it("should call onOpenDrawer when the menu button is clicked", async () => {
        mockGetByUrl({ [API_ROUTES.auth.me]: null });
        const onOpenDrawer = jest.fn();

        renderWithProviders(<AppHeader onOpenDrawer={onOpenDrawer} />);

        await userEvent.click(
            screen.getByRole("button", { name: "Open menu" }),
        );

        expect(onOpenDrawer).toHaveBeenCalledTimes(1);
    });

    it("should open the logout confirmation modal when the logout button is clicked", async () => {
        mockGetByUrl({ [API_ROUTES.auth.me]: null });

        const { store } = renderWithProviders(
            <AppHeader onOpenDrawer={jest.fn()} />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));

        expect(store.getState().ui.modal).toEqual(
            expect.objectContaining({ type: MODAL_TYPE.logout }),
        );
    });

    it("should show the current user's initials in the avatar once loaded", async () => {
        mockGetByUrl({
            [API_ROUTES.auth.me]: {
                id: 1,
                name: "Claude",
                surname: "Cook",
                login: "claude",
            },
        });

        renderWithProviders(<AppHeader onOpenDrawer={jest.fn()} />);

        expect(await screen.findByText("CC")).toBeInTheDocument();
    });
});
