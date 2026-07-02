import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { API_ROUTES } from "api/endpoints";

import { MODAL_TYPE } from "redux/slices/uiSlice";

import { MobileNavDrawer } from "components/layout/MobileNavDrawer";

import { mockGetByUrl } from "test/apiClientMock";
import { renderWithProviders } from "test/router";

jest.mock("api/client");

const stubCurrentUser = () => {
    mockGetByUrl({ [API_ROUTES.auth.me]: null });
};

describe("MobileNavDrawer", () => {
    it("should call onClose when the overlay is clicked", async () => {
        stubCurrentUser();
        const onClose = jest.fn();

        renderWithProviders(<MobileNavDrawer isOpen onClose={onClose} />);

        await userEvent.click(screen.getByRole("presentation"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should close and open the logout confirmation modal when logout is clicked", async () => {
        stubCurrentUser();
        const onClose = jest.fn();

        const { store } = renderWithProviders(
            <MobileNavDrawer isOpen onClose={onClose} />,
        );

        await userEvent.click(screen.getByRole("button", { name: "Logout" }));

        expect(onClose).toHaveBeenCalledTimes(1);
        expect(store.getState().ui.modal).toEqual(
            expect.objectContaining({ type: MODAL_TYPE.logout }),
        );
    });

    it("should close when Escape is pressed while open", async () => {
        stubCurrentUser();
        const onClose = jest.fn();

        renderWithProviders(<MobileNavDrawer isOpen onClose={onClose} />);

        await userEvent.keyboard("{Escape}");

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not listen for Escape when closed", async () => {
        stubCurrentUser();
        const onClose = jest.fn();

        renderWithProviders(
            <MobileNavDrawer isOpen={false} onClose={onClose} />,
        );

        await userEvent.keyboard("{Escape}");

        expect(onClose).not.toHaveBeenCalled();
    });

    it("should show the account placeholder before the current user loads", () => {
        stubCurrentUser();

        renderWithProviders(<MobileNavDrawer isOpen onClose={jest.fn()} />);

        expect(screen.getByText("My account")).toBeInTheDocument();
    });

    it("should show the current user's name and initials once loaded", async () => {
        mockGetByUrl({
            [API_ROUTES.auth.me]: {
                id: 1,
                name: "Claude",
                surname: "Cook",
                login: "claude",
            },
        });

        renderWithProviders(<MobileNavDrawer isOpen onClose={jest.fn()} />);

        expect(await screen.findByText("Claude Cook")).toBeInTheDocument();
        expect(screen.getByText("CC")).toBeInTheDocument();
    });
});
